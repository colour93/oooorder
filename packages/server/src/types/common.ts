export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PRODUCTION = 'production',
  BAKING = 'baking',
  PACKAGING = 'packaging',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum ProductionBatchStatus {
  PLANNED = 'planned',
  IN_PRODUCTION = 'in_production',
  BAKING = 'baking',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ProductItemStatus {
  PRODUCED = 'produced',
  PACKAGED = 'packaged',
  SHIPPED = 'shipped'
}

export enum InvitationCodeStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  USED_UP = 'used_up',
  CANCELLED = 'cancelled'
}

export enum CollectionBatchStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  COMPLETED = 'completed'
}

export enum EquipmentStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  BROKEN = 'broken'
}

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave'
}
