export const CAR_MAKES = [
    'Toyota',
    'Honda',
    'Suzuki',
    'Nissan',
    'Hyundai',
    'Kia',
    'BMW',
    'Mercedes',
    'Audi',
    'Volkswagen',
    'Ford',
    'Chevrolet',
    'Tesla',
    'Porsche',
    'Lexus',
    'Mazda',
    'Mitsubishi',
    'Jeep',
    'Land Rover',
    'Other',
] as const;

export const CAR_MODELS_BY_MAKE: Record<string, string[]> = {
    Toyota: [
        'Corolla',
        'Camry',
        'Yaris',
        'Land Cruiser',
        'Prado',
        'Fortuner',
        'Hilux',
        'Other',
    ],

    Honda: ['Civic', 'Accord', 'City', 'CR-V', 'Other'],

    Suzuki: ['Alto', 'Cultus', 'Swift', 'Wagon R', 'Other'],

    BMW: ['3 Series', '5 Series', 'X3', 'X5', 'Other'],

    Tesla: ['Model 3', 'Model Y', 'Other'],

    Jeep: ['Wrangler', 'Other'],

    Other: ['Other'],
};

export const BODY_TYPES = [
    'sedan',
    'sports',
    'hatchback',
    'convertible',
    'suv',
    'coupe'
] as const;
