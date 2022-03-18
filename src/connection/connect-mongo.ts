import { MongoClientOptions } from 'mongodb';
import { MongoClient } from 'mongodb';
import { resolve } from "path";

export class Connection{

    private readonly database: string = process.env.ATLAS_DATABASE_NAME as string;
    private readonly mongoURI: string = process.env.ATLAS_MONGO_URL as string;
    private readonly orderCollection = 'orders';


async connect(orderId:any): Promise<any>{
    return new Promise<any>(async(resolve, reject) => {
        try{ 
            console.log(`Start connection MongoDb`);
            MongoClient.connect(this.mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                masPoolSize: 1
            }as MongoClientOptions, async(error, orderId: any) => {
                if(error){
                    console.log(`Error While Mongo Connection: ${error}`);
                    reject({
                        valid: false,
                        statusCode: 500,
                        reason: error
                    });
                }else{
                    resolve({
                        valid: true,
                        stautsCode: 201,
                        reason: `valid connection`
                    })
                    console.log('Mongo Client Connected');
                    const order: any = await orderId.db(this.database).collection(this.orderCollection).findOne({'orderCode': orderId})
                    if(order){
                        return console.log(`external id: ${orderId} `);
                    }
            
                }
            })
        }
        finally{ 
         await orderId.close();
        }
    });
}
}