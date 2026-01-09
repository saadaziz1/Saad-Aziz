import { Controller, Post, Body, Headers, BadRequestException, Req, Inject, forwardRef } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../../common/enums/order-status.enum';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        // Inject OrdersService to update order status on webhook
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
    ) { }

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number; currency?: string; metadata?: any }) {
        if (!body.amount) {
            throw new BadRequestException('Amount is required');
        }
        return this.paymentsService.createPaymentIntent(body.amount, body.currency, body.metadata);
    }

    @Post('webhook')
    async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req: any) {
        if (!signature) {
            throw new BadRequestException('Missing stripe-signature header');
        }

        // Capture raw body. NestJS raw body handling requires specific setup or middleware.
        // Assuming we can access the raw body from req.body if the parser is configured correctly for this route,
        // OR we use a custom raw body interceptor. 
        // For now, passing req.body assuming it is the buffer or raw string if app is configured.
        // If not, this might fail without raw-body middleware.
        // Use req.rawBody if available (e.g. from a middleware).
        const payload = req.rawBody || req.body;

        let event;
        try {
            event = this.paymentsService.constructEventFromPayload(signature, payload);
        } catch (err: any) {
            throw new BadRequestException(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent.id);

            // Update order status
            await this.ordersService.updateStatusByPaymentIntent(paymentIntent.id, OrderStatus.PAID);
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            console.log('PaymentIntent failed!', paymentIntent.id);

            await this.ordersService.updateStatusByPaymentIntent(paymentIntent.id, OrderStatus.CANCELLED);
        }

        return { received: true };
    }
}
