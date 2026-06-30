import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import {
  ConfirmPaymentRequest,
  CreatePaymentIntentRequest,
  PaymentConfirmation,
  PaymentConfirmationStatus,
  PaymentIntent,
} from 'src/app/core/models/payment.model';

@Injectable()
export class MockPaymentInterceptor implements HttpInterceptor {
  private readonly intents = new Map<string, PaymentIntent>();
  private readonly responseDelayMs = 550;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const endpoint = this.getPaymentEndpoint(req);

    if (!endpoint) {
      return next.handle(req);
    }

    if (endpoint === 'intents') {
      return this.createIntent(req.body as CreatePaymentIntentRequest);
    }

    return this.confirmPayment(req.body as ConfirmPaymentRequest);
  }

  private createIntent(
    request: CreatePaymentIntentRequest,
  ): Observable<HttpEvent<PaymentIntent>> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
    const paymentMethods = request.paymentMethods.length
      ? request.paymentMethods
      : ['card', 'gcash', 'cod'];
    const intent: PaymentIntent = {
      id: this.createId('pi_mock'),
      clientSecret: this.createId('secret_mock'),
      amount: this.toPositiveAmount(request.amount),
      currency: request.currency || 'PHP',
      status: 'requires_confirmation',
      createdAtUtc: now.toISOString(),
      expiresAtUtc: expiresAt.toISOString(),
      paymentMethods: paymentMethods.map((code) => ({
        code,
        label: this.toPaymentMethodLabel(code),
      })),
    };

    this.intents.set(intent.id, intent);

    return of(new HttpResponse({ status: 201, body: intent })).pipe(
      delay(this.responseDelayMs),
    );
  }

  private confirmPayment(
    request: ConfirmPaymentRequest,
  ): Observable<HttpEvent<PaymentConfirmation>> {
    const intent = this.intents.get(request.intentId);

    if (!intent) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            statusText: 'Not Found',
            error: { message: 'Payment intent was not found.' },
          }),
      );
    }

    const status = this.resolveStatus(request);
    const confirmation: PaymentConfirmation = {
      id: this.createId('pay_mock'),
      intentId: intent.id,
      status,
      amount: intent.amount,
      currency: intent.currency,
      paymentMethod: request.paymentMethod,
      confirmedAtUtc: new Date().toISOString(),
      ...(status === 'success'
        ? { transactionId: this.createId('txn_mock') }
        : {}),
      ...(status === 'failed'
        ? { failureReason: this.getFailureReason(request.paymentMethod) }
        : {}),
      ...(status === 'pending'
        ? { nextAction: this.getPendingAction(request.paymentMethod) }
        : {}),
    };

    return of(new HttpResponse({ status: 200, body: confirmation })).pipe(
      delay(this.responseDelayMs),
    );
  }

  private getPaymentEndpoint(
    req: HttpRequest<unknown>,
  ): 'intents' | 'confirm' | null {
    if (req.method !== 'POST') {
      return null;
    }

    const [path] = req.url.split('?');
    const match = path.match(/^\/api\/(?:(?:ph|fr|cn|jp)\/)?payments\/(.+)$/);
    const endpoint = match?.[1];

    return endpoint === 'intents' || endpoint === 'confirm' ? endpoint : null;
  }

  private resolveStatus(
    request: ConfirmPaymentRequest,
  ): PaymentConfirmationStatus {
    const method = request.paymentMethod;

    if (method === 'cod') {
      return 'pending';
    }

    if (method === 'gcash') {
      const mobile = request.paymentDetails.walletMobileNumber ?? '';

      if (mobile.endsWith('0000')) {
        return 'failed';
      }

      return mobile.endsWith('9999') ? 'pending' : 'success';
    }

    if (method === 'alipay' || method === 'wechat-pay') {
      return 'success';
    }

    const cardLast4 = request.paymentDetails.cardLast4 ?? '';

    if (cardLast4 === '0000') {
      return 'failed';
    }

    return cardLast4 === '9999' ? 'pending' : 'success';
  }

  private getFailureReason(paymentMethod: string): string {
    if (
      paymentMethod === 'gcash' ||
      paymentMethod === 'alipay' ||
      paymentMethod === 'wechat-pay'
    ) {
      return 'Wallet authorization was declined.';
    }

    return 'The payment could not be authorized by the issuer.';
  }

  private getPendingAction(paymentMethod: string): string {
    if (paymentMethod === 'cod') {
      return 'Collect payment when the order is delivered.';
    }

    if (
      paymentMethod === 'gcash' ||
      paymentMethod === 'alipay' ||
      paymentMethod === 'wechat-pay'
    ) {
      return 'Wallet authorization is still pending.';
    }

    return 'Card authentication is still pending.';
  }

  private createId(prefix: string): string {
    const random =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
        : Math.random().toString(36).slice(2, 14);

    return `${prefix}_${random}`;
  }

  private toPositiveAmount(amount: number): number {
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
  }

  private toPaymentMethodLabel(code: string): string {
    const labels: Record<string, string> = {
      card: 'Credit / Debit Card',
      gcash: 'GCash',
      cod: 'Cash on Delivery',
      unionpay: '银行卡 / 银联',
      alipay: '支付宝',
      'wechat-pay': '微信支付',
    };

    return labels[code] ?? code;
  }
}
