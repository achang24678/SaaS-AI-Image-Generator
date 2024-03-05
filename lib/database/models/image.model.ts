import { Document, Schema, model, models } from "mongoose";

export interface IImage extends Document { // extends Document from mongoose to use feature like _id
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string; // URL type is typically represented as string in TypeScript
    width?: number; // Optional field
    height?: number; // Optional field
    config?: object; // More specific type can be used if the shape of config is known
    transformationUrl?: string; // Optional, URL as string
    aspectRatio?: string; // Optional field
    color?: string; // Optional field
    prompt?: string; // Optional field
    author: {
        _id: string;
        firstName: string;
        lastName: string;
    }
    createdAt?: Date; // Date type in TypeScript
    updatedAt?: Date; // Date type in TypeScript
}


const ImageSchema = new Schema({
    title: { type: String, required: true },
    transformationType: { type: String, required: true },
    publicId: { type: String, required: true },
    secureURL: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    config: { type: Object },
    transformationUrl: { type: String },
    aspectRatio: { type: String },
    color: { type: String },
    prompt: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Image = models?.Image || model('Image', ImageSchema);

export default Image;