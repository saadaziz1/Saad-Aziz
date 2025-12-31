export enum CarMake {
    TOYOTA = 'Toyota',
    HONDA = 'Honda',
    SUZUKI = 'Suzuki',
    NISSAN = 'Nissan',
    HYUNDAI = 'Hyundai',
    KIA = 'Kia',
    BMW = 'BMW',
    MERCEDES = 'Mercedes',
    AUDI = 'Audi',
    VOLKSWAGEN = 'Volkswagen',
    FORD = 'Ford',
    CHEVROLET = 'Chevrolet',
    TESLA = 'Tesla',
    PORSCHE = 'Porsche',
    LEXUS = 'Lexus',
    MAZDA = 'Mazda',
    MITSUBISHI = 'Mitsubishi',
    JEEP = 'Jeep',
    LAND_ROVER = 'Land Rover',
    OTHER = 'Other',
}


export enum CarModel {
    // Toyota
    COROLLA = 'Corolla',
    CAMRY = 'Camry',
    YARIS = 'Yaris',
    LAND_CRUISER = 'Land Cruiser',
    PRADO = 'Prado',
    FORTUNER = 'Fortuner',
    HILUX = 'Hilux',

    // Honda
    CIVIC = 'Civic',
    ACCORD = 'Accord',
    CITY = 'City',
    CRV = 'CR-V',

    // Suzuki
    ALTO = 'Alto',
    CULTUS = 'Cultus',
    SWIFT = 'Swift',
    WAGON_R = 'Wagon R',

    // BMW
    SERIES_3 = '3 Series',
    SERIES_5 = '5 Series',
    X3 = 'X3',
    X5 = 'X5',

    // Others / shared
    MUSTANG = 'Mustang',
    MODEL_3 = 'Model 3',
    MODEL_Y = 'Model Y',
    WRANGLER = 'Wrangler',

    OTHER = 'Other',
}

export const MAKE_MODEL_MAP: Record<CarMake, CarModel[]> = {
    [CarMake.TOYOTA]: [
        CarModel.COROLLA,
        CarModel.CAMRY,
        CarModel.YARIS,
        CarModel.LAND_CRUISER,
        CarModel.PRADO,
        CarModel.FORTUNER,
        CarModel.HILUX,
        CarModel.OTHER,
    ],

    [CarMake.HONDA]: [
        CarModel.CIVIC,
        CarModel.ACCORD,
        CarModel.CITY,
        CarModel.CRV,
        CarModel.OTHER,
    ],

    [CarMake.SUZUKI]: [
        CarModel.ALTO,
        CarModel.CULTUS,
        CarModel.SWIFT,
        CarModel.WAGON_R,
        CarModel.OTHER,
    ],

    [CarMake.NISSAN]: [CarModel.OTHER],
    [CarMake.HYUNDAI]: [CarModel.OTHER],
    [CarMake.KIA]: [CarModel.OTHER],
    [CarMake.MERCEDES]: [CarModel.OTHER],
    [CarMake.AUDI]: [CarModel.OTHER],
    [CarMake.VOLKSWAGEN]: [CarModel.OTHER],
    [CarMake.FORD]: [CarModel.OTHER],
    [CarMake.CHEVROLET]: [CarModel.OTHER],
    [CarMake.TESLA]: [CarModel.MODEL_3, CarModel.MODEL_Y, CarModel.OTHER],
    [CarMake.PORSCHE]: [CarModel.OTHER],
    [CarMake.LEXUS]: [CarModel.OTHER],
    [CarMake.MAZDA]: [CarModel.OTHER],
    [CarMake.MITSUBISHI]: [CarModel.OTHER],
    [CarMake.JEEP]: [CarModel.WRANGLER, CarModel.OTHER],
    [CarMake.LAND_ROVER]: [CarModel.OTHER],
    [CarMake.BMW]: [
        CarModel.SERIES_3,
        CarModel.SERIES_5,
        CarModel.X3,
        CarModel.X5,
        CarModel.OTHER,
    ],

    [CarMake.OTHER]: [CarModel.OTHER],
};