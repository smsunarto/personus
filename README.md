# 🦄 Personus

## Identity generation and onboarding interface

The frontend can be found at `packages/next-app`

To play with it, go to the hardhat folder and run

```
yarn chain
yarn hardhat deploy --group 42 --network localhost
```

Then go to the next-app folder and run

```
yarn dev
```

![https://i.imgur.com/MZxs50g.png](https://i.imgur.com/MZxs50g.png)

## Smart Contracts

The project contains two smart contracts

- `Personus`: The core personus contract that provides vouch-based identity commitment induction
- `PersonusConsumer`: A demo contract that consumes the Personus identity commitments

### Tests

The tests for the smart contract can be found at `/packages/hardhat/test`

```
yarn test
```

![https://i.imgur.com/trPApgz.png](https://i.imgur.com/trPApgz.png)

## Acknowledgement

- Written for https://rdi.berkeley.edu/berkeley-defi/f22
- Work built on top of Semaphore (https://github.com/semaphore-protocol/semaphore)
