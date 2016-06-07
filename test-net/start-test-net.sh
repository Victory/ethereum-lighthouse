#!/bin/sh

CMD="geth"
CURDIR=$(dirname $0)
DATADIR="$CURDIR/eth-data"
GENFILE="CustomGenesis.json"
IDENT="VictoryTestNet"
RPCARGS=" --rpc --rpcapi 'db,eth,net,web3' --rpcport 8080 --rpccorsdomain '*' "
IPCPATH="geth.ipc"

ARGS=" --nodiscover --maxpeers 0 $RPCARGS --datadir $DATADIR --port 30303 --identity $IDENT "
#ARGS=" --datadir $DATADIR  init $CURDIR/$GENFILE"
#ARGS=" --datadir $DATADIR --ipcpath $IPCPATH attach "
echo $CMD $ARGS
