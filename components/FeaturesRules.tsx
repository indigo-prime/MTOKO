import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {Check, X} from 'lucide-react';

interface FeaturesRulesProps {
    features: { id: string; name: string }[];
    rules: { id: string; text: string }[];
}

const FeaturesRules = ({ features, rules }: FeaturesRulesProps) => {
    return (
        <div className="container mx-auto px-4 py-12 bg-sand-beige/20">
            {/* Section Header */}
            <div className="text-center mb-12">

                <p className="text-xl text-muted-foreground">
                    Consider the following when choosing us
                </p>
            </div>


            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                <Card className="relative rounded-xl border-2 border-green-500">

                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                  What we offer
                </span>
                    </div>
                    <CardContent>
                        <ul className="space-y-3 mb-8 mt-9">
                            {features.map((feature) => (
                                <li key={feature.id} className="flex items-start">
                                    <Check className="w-5 h-5 bg-green-600 rounded-2xl text-mtoko-light mt-0.5 mr-3 flex-shrink-0" />
                                    <span className="text-muted-foreground">{feature.name}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>


                <Card className="relative rounded-xl border-2 border-red-500">

                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                  Our rules
                </span>
                    </div>
                    <CardContent>
                        <ul className="space-y-3 mb-8 mt-9">
                            {rules.map((rule) => (
                                <li key={rule.id} className="flex items-start">
                                    <X className="w-5 h-5 bg-red-600 rounded-2xl text-mtoko-light mt-0.5 mr-3 flex-shrink-0" />
                                    <span className="text-muted-foreground">{rule.text}</span>
                                </li>
                            ))}
                        </ul>


                    </CardContent>
                </Card>
            </div>


        </div>
    );
};

export default FeaturesRules;