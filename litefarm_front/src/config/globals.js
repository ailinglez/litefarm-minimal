export const host = 'http://localhost';
export const port = '3000';
export const MeasureSystem = {
    METRIC: 0,
    IMPERIAL: 1
}

export function decodeToken(){
    let token = localStorage.getItem('bearer_token').split('.')[1];
    let objectToBe = token.replace('-', '+');
    objectToBe = objectToBe.replace('_', '/');
    switch (objectToBe % 4) {
        case 0:
            break;
        case 2:
            objectToBe = objectToBe + '==';
            break;
        case 3:
            objectToBe = objectToBe + '=';
            break;
    }
    
    return atob(objectToBe)
}