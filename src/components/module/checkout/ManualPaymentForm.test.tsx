// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ManualPaymentForm from "./ManualPaymentForm";
import { paymentInfo } from "@/constants/payment";

const renderForm = (props: Partial<React.ComponentProps<typeof ManualPaymentForm>> = {}) =>
  render(
    <ManualPaymentForm
      onBack={() => {}}
      onPaymentComplete={vi.fn()}
      manualAmount={5000}
      batch="8"
      {...props}
    />
  );

describe("ManualPaymentForm currency", () => {
  it("defaults to the INR manual-payment account", () => {
    expect(paymentInfo.currency).toBe("INR");
    renderForm();
    expect(screen.getByText(/Amount: INR/)).toBeInTheDocument();
  });

  it("renders the batch currency when provided (e.g. BDT batches)", () => {
    renderForm({ manualCurrency: "BDT" });
    expect(screen.getByText(/Amount: ৳/)).toBeInTheDocument();
    expect(screen.queryByText(/INR/)).not.toBeInTheDocument();
  });
});
