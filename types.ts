
export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
}

export enum MessageSender {
  USER = 'user',
  OTHER = 'other',
}

export interface ChatMessage {
  id: string;
  courseId: string;
  sender: User | { name: string }; // Simplified for example
  senderType: MessageSender;
  text: string;
  timestamp: Date;
  attachment?: {
    name: string;
    type: 'image' | 'video' | 'audio' | 'file';
    url?: string; // For display, not actual upload
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: User;
  postDate: Date;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum PaymentMethod {
  CARD = 'Card',
  BKASH = 'bKash',
}
