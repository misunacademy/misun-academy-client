import { CreditCard, Smartphone } from "lucide-react";
import Image from "next/image";
import one from "@/assets/images/payments/one.png";
import two from "@/assets/images/payments/two.png";
import three from "@/assets/images/payments/three.png";
import four from "@/assets/images/payments/four.png";
import five from "@/assets/images/payments/five.png";
import six from "@/assets/images/payments/six.png";
import seven from "@/assets/images/payments/seven.png";
import eight from "@/assets/images/payments/eight.png";
import nine from "@/assets/images/payments/nine.png";
import ten from "@/assets/images/payments/ten.png";
import phonepay from "@/assets/images/payments/phonepay.png";

const GATEWAY_ICONS = [one, two, three, four, six, seven, eight, nine, ten, five];

interface PaymentMethodSelectorProps {
  value: string | undefined;
  onChange: (value: "SSLCommerz" | "phonePay") => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="grid gap-3">
      <SSLCommerzOption selected={value === "SSLCommerz"} onSelect={() => onChange("SSLCommerz")} />
      <PhonePayOption selected={value === "phonePay"} onSelect={() => onChange("phonePay")} />
    </div>
  );
}

function SSLCommerzOption({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return (
    <div
      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
        selected
          ? 'border-primary bg-primary/10 shadow-[0_0_24px_hsl(156_70%_42%/0.2)]'
          : 'border-primary/20 bg-primary/4 hover:border-primary/40'
      }`}
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
    >
      <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 border border-yellow-500/30 text-yellow-400">
        Popular
      </span>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white/85">SSLCommerz</h4>
          </div>
          <RadioIndicator selected={selected} />
        </div>
        <div className="items-center gap-2 pt-2 border-t border-primary/15">
          <span className="text-xs text-white/40 mb-2 block">Pay with:</span>
          <div className="grid grid-cols-3 gap-1.5">
            {GATEWAY_ICONS.map((src, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden flex items-center justify-center h-[52px]">
                <Image src={src} alt="payment gateway" className="object-contain w-full h-full p-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhonePayOption({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return (
    <div
      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
        selected
          ? 'border-primary bg-primary/10 shadow-[0_0_24px_hsl(156_70%_42%/0.2)]'
          : 'border-primary/20 bg-primary/4 hover:border-primary/40'
      }`}
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white/85">Phone Pay</h4>
        </div>
        <RadioIndicator selected={selected} />
      </div>
      <div className="border-t border-primary/15 pt-3">
        <p className="text-xs text-white/45 pb-2">Pay with your phone pay account:</p>
        <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center h-[56px] max-w-[200px]">
          <Image src={phonepay} alt="Phone Pay" className="object-contain w-full h-full p-2" />
        </div>
      </div>
    </div>
  );
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-4 h-4 rounded-full border-2 transition-colors ${
        selected ? 'border-primary bg-primary' : 'border-white/30'
      }`}
    >
      {selected && <div className="w-full h-full rounded-full bg-white scale-[0.45]" />}
    </div>
  );
}
