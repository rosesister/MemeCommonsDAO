;; MemeCommonsDAO - Licensing Vault Contract
;; Clarity v2

(define-constant ERR-NOT-ADMIN u100)
(define-constant ERR-NOT-CREATOR u101)
(define-constant ERR-NOT-FOUND u102)
(define-constant ERR-ALREADY-LICENSED u103)
(define-constant ERR-INVALID-LICENSE-TYPE u104)
(define-constant ERR-INSUFFICIENT-PAYMENT u105)
(define-constant ERR-ZERO-ADDRESS u106)

(define-constant LICENSE-TYPES 
  (list
    (tuple (id u1) (name "CC0") (price u0))
    (tuple (id u2) (name "Commercial") (price u1000000)) ;; 1 STX
    (tuple (id u3) (name "Extended") (price u5000000)) ;; 5 STX
  )
)

(define-data-var admin principal tx-sender)

(define-map meme-creators uint principal) ;; token-id -> creator
(define-map licenses (tuple (token-id uint) (buyer principal)) (tuple (license-type uint) (timestamp uint)))
(define-map license-metadata uint (tuple (license-type uint) (price uint)))

(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

(define-private (get-license-type-price (license-type uint))
  (let 
    (
      (result (filter (lambda (lt)
                        (is-eq license-type (get id lt)))
                      LICENSE-TYPES))
    )
    (if (is-some result)
        (ok (get price (unwrap-panic (get some result))))
        (err ERR-INVALID-LICENSE-TYPE)
    )
  )
)

;; Set creator for a meme NFT (called from minting contract)
(define-public (register-creator (token-id uint) (creator principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-ADMIN))
    (map-set meme-creators token-id creator)
    (ok true)
  )
)

;; Register license types dynamically (optional override)
(define-public (set-license-type (license-type uint) (price uint))
  (begin
    (asserts! (is-admin) (err ERR-NOT-ADMIN))
    (map-set license-metadata license-type (tuple (license-type license-type) (price price)))
    (ok true)
  )
)

;; Purchase a license for an NFT
(define-public (purchase-license (token-id uint) (license-type uint))
  (let 
    (
      (creator (map-get? meme-creators token-id))
      (existing (map-get? licenses (tuple (token-id token-id) (buyer tx-sender))))
      (price-result (get-license-type-price license-type))
    )
    (begin
      (asserts! (is-some creator) (err ERR-NOT-FOUND))
      (asserts! (is-none existing) (err ERR-ALREADY-LICENSED))
      (match price-result price
        (begin
          (asserts! (>= (stx-get-balance tx-sender) price) (err ERR-INSUFFICIENT-PAYMENT))
          (stx-transfer? price tx-sender (unwrap-panic (get some creator)))
          (map-set licenses (tuple (token-id token-id) (buyer tx-sender)) 
            (tuple (license-type license-type) (timestamp (block-height))))
          (ok true)
        )
        (err (err-code) (err err-code))
      )
    )
  )
)

;; Check if user holds valid license
(define-read-only (get-license (token-id uint) (buyer principal))
  (match (map-get? licenses (tuple (token-id token-id) (buyer buyer)))
    license-data (ok license-data)
    (err ERR-NOT-FOUND)
  )
)

;; View creator of meme
(define-read-only (get-creator (token-id uint))
  (match (map-get? meme-creators token-id)
    creator (ok creator)
    (err ERR-NOT-FOUND)
  )
)

;; View license price
(define-read-only (get-license-price (license-type uint))
  (get-license-type-price license-type)
)

;; Admin transfer
(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-ADMIN))
    (asserts! (not (is-eq new-admin 'SP000000000000000000002Q6VF78)) (err ERR-ZERO-ADDRESS))
    (var-set admin new-admin)
    (ok true)
  )
)
