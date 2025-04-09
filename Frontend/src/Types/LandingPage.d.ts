export interface Options{
    label: string;
    value: string;
    logo: string;
    unicode? : string
}


export interface GuestType{
    name: string;
    ages: string;
    isActive : boolean;
}

export interface Option {
    value: string;
 }

export interface MinimumNightlyRate {
    date:            string;
    price:           number;
    discountedPrice ?: number;
}

export interface MinimumNightlyRateDateValue {
    price:           number;
    discountedPrice ?: number;
}


