export interface StripeErrorInfo {
  type?: string
  code?: string
  message?: string
}

export interface FormattedStripeError {
  title: string
  description: string
}

const cardErrorMap: Record<string, FormattedStripeError> = {
  insufficient_funds: {
    title: "Insufficient Funds",
    description: "Your card doesn't have sufficient funds. Please use a different card.",
  },
  expired_card: {
    title: "Card Expired",
    description: "Your card has expired. Please use a different card.",
  },
  incorrect_cvc: {
    title: "Invalid Security Code",
    description: "The security code (CVC) you entered is incorrect. Please check and try again.",
  },
  invalid_cvc: {
    title: "Invalid Security Code",
    description: "The security code (CVC) you entered is incorrect. Please check and try again.",
  },
  incorrect_number: {
    title: "Invalid Card Number",
    description: "The card number you entered is incorrect. Please check and try again.",
  },
  invalid_number: {
    title: "Invalid Card Number",
    description: "The card number you entered is incorrect. Please check and try again.",
  },
  invalid_expiry_month: {
    title: "Invalid Expiry Date",
    description: "The card expiry date you entered is invalid. Please check and try again.",
  },
  invalid_expiry_year: {
    title: "Invalid Expiry Date",
    description: "The card expiry date you entered is invalid. Please check and try again.",
  },
  lost_card: {
    title: "Card Not Supported",
    description: "This card cannot be used. Please try a different payment method.",
  },
  stolen_card: {
    title: "Card Not Supported",
    description: "This card cannot be used. Please try a different payment method.",
  },
  fraudulent: {
    title: "Security Check Failed",
    description:
      "Your bank declined this transaction for security reasons. Please contact your bank or try a different card.",
  },
  pickup_card: {
    title: "Security Check Failed",
    description:
      "Your bank declined this transaction for security reasons. Please contact your bank or try a different card.",
  },
  processing_error: {
    title: "Processing Error",
    description: "There was an error processing your card. Please try again.",
  },
}

export function formatStripeError(err: StripeErrorInfo): FormattedStripeError {
  if (!err || (!err.type && !err.code && !err.message)) {
    return { title: "Payment Failed", description: "Transaction could not be processed." }
  }

  const type = err.type ?? ""
  const code = err.code ?? ""

  if (type === "card_error" || type === "invalid_request_error") {
    const mapped = cardErrorMap[code]
    if (mapped) return mapped
    return {
      title: "Card Declined",
      description: `Your card was declined. Please try a different payment method.`,
    }
  }

  if (type === "validation_error") {
    const mapped = cardErrorMap[code]
    if (mapped) return mapped
    return {
      title: "Invalid Details",
      description: err.message ?? "The payment details you entered are invalid. Please check and try again.",
    }
  }

  if (type === "bank_transfer_error") {
    return {
      title: "Bank Transfer Failed",
      description: "The bank transfer could not be completed. Please try a different payment method.",
    }
  }

  if (code === "card_declined") {
    return {
      title: "Card Declined",
      description: "Your card was declined. Please try a different payment method.",
    }
  }

  if (type === "rate_limit_error") {
    return {
      title: "Try Again",
      description: "Too many attempts. Please wait a moment and try again.",
    }
  }

  if (type === "api_connection_error" || type === "api_error") {
    return {
      title: "Service Error",
      description: "Our payment processor encountered an error. Please try again.",
    }
  }

  if (type === "authentication_error") {
    return {
      title: "Authentication Failed",
      description: "Payment authentication failed. Please try again or use a different card.",
    }
  }

  return {
    title: "Payment Failed",
    description: err.message ?? "Transaction could not be processed.",
  }
}
