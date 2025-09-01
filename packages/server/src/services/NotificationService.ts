import { AppDataSource } from '../config/database';
import { Order } from '../entities/Order';
import { User } from '../entities/User';
import { sendEmail } from '../utils/email';

export class NotificationService {
  private orderRepository = AppDataSource.getRepository(Order);
  private userRepository = AppDataSource.getRepository(User);

  async sendOrderStatusUpdate(orderId: string): Promise<void> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['user', 'items', 'items.sku', 'items.sku.product']
      });

      if (!order) {
        console.error(`Order ${orderId} not found for notification`);
        return;
      }

      const statusMessages = {
        pending: '您的订单已创建，等待确认',
        confirmed: '您的订单已确认，开始准备',
        production: '您的订单正在生产中',
        baking: '您的订单正在烘烤中',
        packaging: '您的订单正在包装中',
        shipping: '您的订单已发货',
        delivered: '您的订单已送达',
        cancelled: '您的订单已取消'
      };

      const itemsList = order.items.map(item => 
        `${item.sku.product.name} (${item.sku.specification}) x ${item.quantity}`
      ).join('<br>');

      await sendEmail({
        to: order.user.email,
        subject: `订单状态更新 - ${order.id}`,
        html: `
          <h2>订单状态更新</h2>
          <p>尊敬的 ${order.user.name}，</p>
          <p>您的订单状态已更新：</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>订单信息</h3>
            <p><strong>订单号:</strong> ${order.id}</p>
            <p><strong>状态:</strong> ${statusMessages[order.status] || order.status}</p>
            <p><strong>商品:</strong></p>
            <div style="margin-left: 20px;">
              ${itemsList}
            </div>
          </div>
          
          <p>如有疑问，请联系客服。</p>
          <p>感谢您的订购！</p>
        `
      });
    } catch (error) {
      console.error('Failed to send order status notification:', error);
    }
  }

  async sendEmailVerification(email: string, verificationCode: string): Promise<void> {
    try {
      await sendEmail({
        to: email,
        subject: '邮箱验证码',
        html: `
          <h2>邮箱验证</h2>
          <p>您的验证码是：<strong style="font-size: 24px; color: #007bff;">${verificationCode}</strong></p>
          <p>验证码将在10分钟后过期。</p>
          <p>如果您没有请求此验证码，请忽略此邮件。</p>
        `
      });
    } catch (error) {
      console.error('Failed to send email verification:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(orderId: string): Promise<void> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['user', 'items', 'items.sku', 'items.sku.product']
      });

      if (!order) {
        console.error(`Order ${orderId} not found for confirmation email`);
        return;
      }

      const itemsList = order.items.map(item => 
        `${item.sku.product.name} (${item.sku.specification}) x ${item.quantity}`
      ).join('<br>');

      await sendEmail({
        to: order.user.email,
        subject: `订单确认 - ${order.id}`,
        html: `
          <h2>订单确认</h2>
          <p>尊敬的 ${order.user.name}，</p>
          <p>感谢您的订购！您的订单已成功创建。</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>订单详情</h3>
            <p><strong>订单号:</strong> ${order.id}</p>
            <p><strong>下单时间:</strong> ${order.createdAt.toLocaleString('zh-CN')}</p>
            <p><strong>收货地址:</strong> ${order.shippingAddress}</p>
            <p><strong>联系方式:</strong> ${order.contactInfo}</p>
            <p><strong>商品清单:</strong></p>
            <div style="margin-left: 20px;">
              ${itemsList}
            </div>
          </div>
          
          <p>我们将尽快处理您的订单，并及时通知您订单状态的变更。</p>
          <p>如有疑问，请联系客服。</p>
        `
      });
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
    }
  }
}
