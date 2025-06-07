//node modules
import { Schema, Types, model } from 'mongoose';

interface IToken{
  token: string,
  userId:Types.ObjectId
}

const tokenSchema=new Schema<IToken>({
  token: {
    type: String,
    required:true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required:true
  }
})

export default model<IToken>('Token',tokenSchema)