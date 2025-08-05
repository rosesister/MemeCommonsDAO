import { describe, it, expect, beforeEach } from "vitest"

type Principal = string
type LicenseType = 1 | 2 | 3

interface LicenseRecord {
  licenseType: LicenseType
  timestamp: number
}

const mockLicensingVault = {
  admin: "ST1ADMIN",
  memeCreators: new Map<number, Principal>(),
  licenses: new Map<string, LicenseRecord>(),
  licensePrices: new Map<LicenseType, bigint>([
    [1, 0n],        // CC0
    [2, 1_000_000n],// Commercial
    [3, 5_000_000n] // Extended
  ]),
  balances: new Map<Principal, bigint>(),

  isAdmin(sender: Principal) {
    return sender === this.admin
  },

  registerCreator(tokenId: number, creator: Principal, sender: Principal) {
    if (!this.isAdmin(sender)) return { error: 100 }
    this.memeCreators.set(tokenId, creator)
    return { value: true }
  },

  purchaseLicense(tokenId: number, licenseType: LicenseType, buyer: Principal) {
    const creator = this.memeCreators.get(tokenId)
    if (!creator) return { error: 102 }
    const key = `${tokenId}-${buyer}`
    if (this.licenses.has(key)) return { error: 103 }
    const price = this.licensePrices.get(licenseType)
    if (price === undefined) return { error: 104 }
    const buyerBal = this.balances.get(buyer) || 0n
    if (buyerBal < price) return { error: 105 }
    this.balances.set(buyer, buyerBal - price)
    this.balances.set(creator, (this.balances.get(creator) || 0n) + price)
    this.licenses.set(key, {
      licenseType,
      timestamp: 123456 // mock block height
    })
    return { value: true }
  },

  getLicense(tokenId: number, buyer: Principal) {
    const key = `${tokenId}-${buyer}`
    const record = this.licenses.get(key)
    return record ? { value: record } : { error: 102 }
  }
}

describe("LicensingVault", () => {
  const admin = "ST1ADMIN"
  const creator = "ST2CREATOR"
  const buyer = "ST3BUYER"
  const tokenId = 42

  beforeEach(() => {
    mockLicensingVault.memeCreators.clear()
    mockLicensingVault.licenses.clear()
    mockLicensingVault.balances = new Map<Principal, bigint>()
    mockLicensingVault.balances.set(buyer, 5_000_000n)
    mockLicensingVault.balances.set(creator, 0n)
  })

  it("should register creator", () => {
    const res = mockLicensingVault.registerCreator(tokenId, creator, admin)
    expect(res).toEqual({ value: true })
    expect(mockLicensingVault.memeCreators.get(tokenId)).toBe(creator)
  })

  it("should allow license purchase", () => {
    mockLicensingVault.registerCreator(tokenId, creator, admin)
    const res = mockLicensingVault.purchaseLicense(tokenId, 2, buyer)
    expect(res).toEqual({ value: true })
    expect(mockLicensingVault.getLicense(tokenId, buyer)).toEqual({
      value: { licenseType: 2, timestamp: 123456 }
    })
    expect(mockLicensingVault.balances.get(buyer)).toBe(4_000_000n)
    expect(mockLicensingVault.balances.get(creator)).toBe(1_000_000n)
  })

  it("should reject duplicate license", () => {
    mockLicensingVault.registerCreator(tokenId, creator, admin)
    mockLicensingVault.purchaseLicense(tokenId, 2, buyer)
    const res = mockLicensingVault.purchaseLicense(tokenId, 2, buyer)
    expect(res).toEqual({ error: 103 })
  })

  it("should reject insufficient balance", () => {
    mockLicensingVault.registerCreator(tokenId, creator, admin)
    mockLicensingVault.balances.set(buyer, 100n)
    const res = mockLicensingVault.purchaseLicense(tokenId, 3, buyer)
    expect(res).toEqual({ error: 105 })
  })

  it("should reject unknown license type", () => {
    mockLicensingVault.registerCreator(tokenId, creator, admin)
    const res = mockLicensingVault.purchaseLicense(tokenId, 99 as LicenseType, buyer)
    expect(res).toEqual({ error: 104 })
  })
})
