/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/neuralbond_solana_program.json`.
 */
export type NeuralbondSolanaProgram = {
  "address": "UfQzdDXyS6huk6DTDKvvM5pTK2VtWQVmaGiNJ5qTJmo",
  "metadata": {
    "name": "neuralbondSolanaProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "deleteMessage",
      "discriminator": [
        198,
        99,
        22,
        204,
        200,
        165,
        54,
        138
      ],
      "accounts": [
        {
          "name": "message",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  101,
                  117,
                  114,
                  97,
                  108,
                  98,
                  111,
                  110,
                  100,
                  109,
                  101,
                  115,
                  115,
                  97,
                  103,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              },
              {
                "kind": "account",
                "path": "receiver"
              }
            ]
          }
        },
        {
          "name": "receiver",
          "writable": true,
          "signer": true
        },
        {
          "name": "sender",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "saveMessageConfig",
      "discriminator": [
        25,
        241,
        0,
        29,
        255,
        239,
        30,
        113
      ],
      "accounts": [
        {
          "name": "messageConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  101,
                  117,
                  114,
                  97,
                  108,
                  98,
                  111,
                  110,
                  100,
                  109,
                  101,
                  115,
                  115,
                  97,
                  103,
                  101,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "receiver"
              }
            ]
          }
        },
        {
          "name": "receiver",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "encryptionPubkey",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "sendMessage",
      "discriminator": [
        57,
        40,
        34,
        178,
        189,
        10,
        65,
        26
      ],
      "accounts": [
        {
          "name": "message",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  101,
                  117,
                  114,
                  97,
                  108,
                  98,
                  111,
                  110,
                  100,
                  109,
                  101,
                  115,
                  115,
                  97,
                  103,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              },
              {
                "kind": "account",
                "path": "receiver"
              }
            ]
          }
        },
        {
          "name": "messageConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  101,
                  117,
                  114,
                  97,
                  108,
                  98,
                  111,
                  110,
                  100,
                  109,
                  101,
                  115,
                  115,
                  97,
                  103,
                  101,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "receiver"
              }
            ]
          }
        },
        {
          "name": "receiver",
          "writable": true
        },
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "encryptedMessage",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "message",
      "discriminator": [
        110,
        151,
        23,
        110,
        198,
        6,
        125,
        181
      ]
    },
    {
      "name": "messageConfig",
      "discriminator": [
        149,
        103,
        166,
        109,
        205,
        232,
        152,
        166
      ]
    }
  ],
  "types": [
    {
      "name": "message",
      "docs": [
        "Holds a message sent by a user."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "receiver",
            "docs": [
              "The receiver of the message"
            ],
            "type": "pubkey"
          },
          {
            "name": "sender",
            "docs": [
              "The sender of the message"
            ],
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "docs": [
              "Current date_time on creation; technically unix_timestamp, i64 but anchor can't tell it's size"
            ],
            "type": "u64"
          },
          {
            "name": "encryptedMessage",
            "docs": [
              "The encrypted message as a base64 string"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "messageConfig",
      "docs": [
        "Holds the message price for a user."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "docs": [
              "The price in lamports to send a message to this user"
            ],
            "type": "u64"
          },
          {
            "name": "receiver",
            "docs": [
              "The receiver of the message"
            ],
            "type": "pubkey"
          },
          {
            "name": "encryptionPubkey",
            "docs": [
              "The encryption pubkey of the receiver"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    }
  ]
};
