import { NIX_APP_ID, NIX_API_KEY } from "@env"

import { NUTRITIONIX_URL } from "../config/app"

export const getNutritions = async data => {
  const response = await fetch(NUTRITIONIX_URL, {
    headers: {
      "Content-Type": "application/json",
      "X-APP-ID": NIX_APP_ID,
      "X-APP-KEY": NIX_API_KEY
    },
    method: "POST",
    body: JSON.stringify({ query: data })
  })

  const res = await response.json()
  return res
}
