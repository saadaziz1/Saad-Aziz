import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
class CartItem {
    @Prop() productId: string;
    @Prop() name: string;
    @Prop() price: number;
    @Prop() image: string;
    @Prop() quantity: number;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema()
export class Cart {
    @Prop({ required: true }) userId: string;

    @Prop({ type: [CartItemSchema], default: [] })
    items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
