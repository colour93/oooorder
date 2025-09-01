import bcrypt from 'bcryptjs';
import { Session } from 'express-session';
import { AppDataSource } from '../config/database';
import { InvitationCode } from '../entities/InvitationCode';
import { User } from '../entities/User';
import { AppError, ErrorCode } from '../middleware/errorHandler';
import { RegisterData } from '../types/auth';
import { InvitationCodeStatus } from '../types/common';
import { generateVerificationCode, sendEmail } from '../utils/email';
import { setSessionUser } from '../utils/session';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private invitationCodeRepository = AppDataSource.getRepository(InvitationCode);

  async register(data: RegisterData, session: Session): Promise<User> {
    // 验证邀请码
    const invitationCode = await this.invitationCodeRepository.findOne({
      where: {
        code: data.invitationCode,
        status: InvitationCodeStatus.ACTIVE
      },
      relations: ['collectionBatch']
    });

    if (!invitationCode) {
      throw new AppError(ErrorCode.INVITATION_CODE_INVALID, 'Invalid invitation code', 400);
    }

    // 检查邀请码是否已用完
    if (invitationCode.usedOrders >= invitationCode.maxOrders) {
      throw new AppError(ErrorCode.INVITATION_CODE_INVALID, 'Invitation code has been used up', 400);
    }

    // 检查采集批次是否过期
    if (invitationCode.collectionBatch.deadline < new Date()) {
      throw new AppError(ErrorCode.INVITATION_CODE_INVALID, 'Collection batch has expired', 400);
    }

    // 检查邮箱是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError(ErrorCode.EMAIL_ALREADY_EXISTS, 'Email already exists', 409);
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      emailVerified: true, // 注册时通过验证码验证
    });

    await this.userRepository.save(user);

    // 设置session
    setSessionUser(session, user);

    return user;
  }

  async login(email: string, password: string, session: Session): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid email or password', 401);
    }

    // 设置session
    setSessionUser(session, user);

    return user;
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const code = generateVerificationCode();

    // 这里应该将验证码存储在缓存中（Redis）或临时表中
    // 为简化示例，暂时省略存储逻辑

    await sendEmail({
      to: email,
      subject: 'Email Verification Code',
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    });
  }

  async verifyEmail(token: string): Promise<void> {
    // 验证邮箱逻辑
    // 这里应该验证token并更新用户的emailVerified状态
    throw new Error('Method not implemented');
  }

  async logout(session: Session): Promise<void> {
    return new Promise((resolve, reject) => {
      session.destroy((err) => {
        if (err) {
          reject(new AppError(ErrorCode.UNAUTHORIZED, 'Could not log out', 500));
        } else {
          resolve();
        }
      });
    });
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId }
    });
  }
}
