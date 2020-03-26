export interface Event {
    merchant_id: string;
    merchant_name: string;
    merchant_slug: string;
    merchant_imageURL: string;

    event_id: string;
    event_imageURL: string;
    event_slug: string;
    title: string;
    subtitle: string;
    description: string;
    dateTime: string;
    location: string;
    access: string;

    createdAt: string;
}