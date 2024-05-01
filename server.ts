import 'dotenv/config'
import express from 'express'
import axios from "axios";
import { StatusCodes } from "http-status-codes";
const sms_api = process.env.SMS_API || 'https://api.sms.com';
const sms_username = process.env.SMS_USERNAME || 'none';
const sms_password = process.env.SMS_PASSWORD || 'none';

const app = express()
async function sendSms(content: string, phoneNumbers: Array<string>) : Promise<any>{        
        const send_payload = JSON.stringify({
            message: content,
            phoneNumbers: phoneNumbers
        })
        const {data} = await axios.post(`${sms_api}`, send_payload, {
            headers: {
                "Content-Type": "application/json",
            },
            auth:{
                username: sms_username,
                password: sms_password
            }
        });
        console.log(data);
}

app.use(express.json())

app.post('/send-sms', async (req, res) => {
    console.log('hello');
    
    const {content, phoneNumbers} = req.body
    try{
        sendSms(content, phoneNumbers);
        res.status(StatusCodes.OK).send("SMS sent successfully");
    }catch(e){
        console.error(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed to send SMS");
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})