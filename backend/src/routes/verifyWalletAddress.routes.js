import { Router } from "express";
import { verifyTokens } from "../middlewares/auth.middlewares.js";
import { onSameWalletAsProfile } from "../middlewares/walletAuth.js";

const onSameWallet = Router()

// /check/onSameWallet
onSameWallet.route("/onSameWallet").post(verifyTokens,onSameWalletAsProfile)


export default onSameWallet