import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    }
});
