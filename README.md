# ddns-action
DDNS(Distributed Domain Name System) update action.

## Inputs

### `mnemonic`

**Required** Mnemonic phrase for wallet recovery. Plain PrivateKey can be used as well.

### `rpc`

**Required** Url of RPC APIs.

### `name`

**Required** Distributed domain name. Currently it supports ENS name only. (eg `ddns-action.eth`)

### `contentHash`

**Required** Hash of content. Currently it supports IPFS hash only.

### `verbose`

Level of verbosity [`false` - quiet, `true` - verbose]. Default `false`

## Example usage

```
uses: aquiladev/ddns-action@v1
with:
  mnemonic: ${{ secrets.MNEMONIC }}
  rpc: ${{ secrets.RPC }}
  name: ddns-action.eth
  contentHash: ${{ steps.upload.outputs.hash }}
```