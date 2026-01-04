import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, CreditCard } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BackButton } from '@/components/ui/back-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PRICING_PLANS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { StripePayment } from '@/components/billing/StripePayment';

export default function Billing() {
  const [activeTab, setActiveTab] = useState('subscription');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <BackButton to="/dashboard" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription, plans, and payment methods
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Methods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-6">
            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Pro Plan
                      </CardTitle>
                      <CardDescription>Your current subscription</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-foreground">₹1,999</div>
                      <div className="text-sm text-muted-foreground">/month</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Reviews Used</span>
                      <span className="font-medium">847 / 1,000</span>
                    </div>
                    <Progress value={84.7} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl font-bold text-foreground">∞</div>
                      <div className="text-xs text-muted-foreground">Repositories</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl font-bold text-foreground">1,000</div>
                      <div className="text-xs text-muted-foreground">Reviews/mo</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl font-bold text-foreground">5</div>
                      <div className="text-xs text-muted-foreground">Team Members</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl font-bold text-foreground">Priority</div>
                      <div className="text-xs text-muted-foreground">Support</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      Manage Subscription
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      View Invoices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pricing Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-foreground">Available Plans</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {PRICING_PLANS.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.3 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card
                      className={cn(
                        'relative h-full transition-shadow hover:shadow-lg',
                        plan.popular && 'border-primary shadow-glow'
                      )}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="pt-4">
                          <span className="text-4xl font-bold text-foreground">
                            {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-muted-foreground">/month</span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-3">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-primary shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className="w-full"
                          variant={plan.popular ? 'default' : 'outline'}
                        >
                          {plan.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="payment">
            <StripePayment />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
