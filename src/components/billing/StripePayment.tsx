import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Plus, 
  Check, 
  Trash2, 
  Star, 
  Lock,
  Building2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  brand?: string;
  last4: string;
  expiry?: string;
  isDefault: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'card', brand: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: '2', type: 'card', brand: 'Mastercard', last4: '8888', expiry: '08/25', isDefault: false },
];

export function StripePayment() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const formatCardNumber = (value: string) => {
    const v = value.replaceAll(/\s+/g, '').replaceAll(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replaceAll(/\s+/g, '').replaceAll(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleAddCard = () => {
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvc || !cardForm.name) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all card details.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newCard: PaymentMethod = {
        id: Date.now().toString(),
        type: 'card',
        brand: cardForm.number.startsWith('4') ? 'Visa' : 'Mastercard',
        last4: cardForm.number.replaceAll(/\s/g, '').slice(-4),
        expiry: cardForm.expiry,
        isDefault: paymentMethods.length === 0,
      };
      setPaymentMethods(prev => [...prev, newCard]);
      setShowAddCard(false);
      setCardForm({ number: '', expiry: '', cvc: '', name: '' });
      setIsProcessing(false);
      toast({
        title: 'Card Added',
        description: 'Your payment method has been added successfully.',
      });
    }, 1500);
  };

  const handleRemoveCard = (id: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
    toast({
      title: 'Card Removed',
      description: 'Payment method has been removed.',
    });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(m => ({ ...m, isDefault: m.id === id }))
    );
    toast({
      title: 'Default Updated',
      description: 'Default payment method has been updated.',
    });
  };

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return (
          <div className="h-8 w-12 rounded bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-xs font-bold">
            VISA
          </div>
        );
      case 'mastercard':
        return (
          <div className="h-8 w-12 rounded bg-gradient-to-r from-destructive to-warning flex items-center justify-center">
            <div className="flex -space-x-2">
              <div className="h-4 w-4 rounded-full bg-destructive" />
              <div className="h-4 w-4 rounded-full bg-warning" />
            </div>
          </div>
        );
      default:
        return <CreditCard className="h-8 w-8 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage your payment methods for subscriptions and purchases
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Payment Methods List */}
      <div className="grid gap-4">
        {paymentMethods.map((method, i) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={method.isDefault ? 'border-primary/30 bg-primary/5' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getCardIcon(method.brand)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {method.brand} •••• {method.last4}
                        </span>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveCard(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add New Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className="border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
            onClick={() => setShowAddCard(true)}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Add New Payment Method</p>
                <p className="text-sm text-muted-foreground">
                  Credit card, debit card, or bank account
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Security Note */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-chart-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Secure Payment Processing</p>
              <p className="text-xs text-muted-foreground">
                Your payment information is encrypted and securely processed by Stripe. 
                We never store your full card details on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Add Payment Method
            </DialogTitle>
            <DialogDescription>
              Add a new credit or debit card to your account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="John Doe"
                value={cardForm.name}
                onChange={(e) => setCardForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <div className="relative">
                <Input
                  id="card-number"
                  placeholder="4242 4242 4242 4242"
                  value={cardForm.number}
                  onChange={(e) => setCardForm(prev => ({ 
                    ...prev, 
                    number: formatCardNumber(e.target.value) 
                  }))}
                  maxLength={19}
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardForm.expiry}
                  onChange={(e) => setCardForm(prev => ({ 
                    ...prev, 
                    expiry: formatExpiry(e.target.value) 
                  }))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cardForm.cvc}
                  onChange={(e) => setCardForm(prev => ({ 
                    ...prev, 
                    cvc: e.target.value.replaceAll(/\D/g, '').slice(0, 4) 
                  }))}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Shield className="h-4 w-4 text-chart-2" />
              <span className="text-xs text-muted-foreground">
                Your card is secured with 256-bit SSL encryption
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCard(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <CreditCard className="h-4 w-4" />
                  </motion.div>
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
