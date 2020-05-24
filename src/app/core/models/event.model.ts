export interface Event {
    partner_id: string;
    partner_name: string;
    partner_slug: string;
    partner_imageURL: string;

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