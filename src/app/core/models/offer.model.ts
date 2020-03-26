interface Address {
  street: string;
  city: string;
  postCode: string;
  coordinates: string[];
}

export interface Offer {
  merchant_id: string;
  merchant_name: string;
  merchant_slug: string;
  merchant_imageURL: string;
  merchant_address: Address;

  offer_id: string;
  offer_imageURL: string;
  offer_slug: string;
  title: string;
  subtitle: string;
  description: string;
  cost: number;
  expiresAt: number;
  createdAt: string;
}