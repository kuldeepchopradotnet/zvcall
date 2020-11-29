import { v5 as uuidv5 } from 'uuid';
export class Helper {

    static getuuid(){
        const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
        //const MY_NAMESPACE = '1b771a64-40d5-491e-99a0-eb01ff1t3341';
        return uuidv5('Hello, World!', MY_NAMESPACE);
    }



}