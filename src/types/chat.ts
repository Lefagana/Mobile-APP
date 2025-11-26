// Chat Domain Types

export interface Chat {
    id: string;
    vendor_id: string;
    customer_id: string;
    customer_name: string;
    customer_avatar?: string;
    order_id?: string; // Optional: chat can be order-specific
    order_number?: string;
    last_message: string;
    last_message_time: string;
    unread_count: number;
    status: 'active' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    chat_id: string;
    sender_type: 'vendor' | 'customer';
    sender_id: string;
    sender_name: string;
    content: string;
    type: 'text' | 'image' | 'file' | 'order_update';
    image_url?: string;
    file_url?: string;
    file_name?: string;
    metadata?: Record<string, any>;
    is_read: boolean;
    created_at: string;
}

export interface MessageTemplate {
    id: string;
    vendor_id: string;
    category: 'greeting' | 'order_update' | 'faq' | 'closing' | 'custom';
    title: string;
    content: string;
    is_active: boolean;
    usage_count: number;
    created_at: string;
    updated_at: string;
}

export interface ChatStats {
    total_chats: number;
    active_chats: number;
    unread_messages: number;
    average_response_time_minutes: number;
    response_rate: number;
}
