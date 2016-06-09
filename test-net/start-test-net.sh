#!/bin/bash

METHOD=""
PASSWORD=""
CMD="geth"
CURDIR=$(dirname $0)
DATADIR="$CURDIR/eth-data"
GENFILE="CustomGenesis.json"
IDENT="VictoryTestNet"
RPCHOST="localhost"
RPCARGS=" --rpc --rpcapi 'db,eth,net,web3' --rpcaddr $RPCHOST --rpcport 8080 --rpccorsdomain '*' "
IPCPATH="geth.ipc"
BASEARGS=" --unlock 0 --nodiscover --maxpeers 0 $RPCARGS --datadir $DATADIR --port 30303 --identity $IDENT --verbosity 6 "

function help {
    echo "
Usage
    $0 [-c|-l|-a|-i|-r|-m $ACCOUNT]

    -i Initialize a new blockchain.

    -r Run an initilized instance.

    -a Attach to a running instance.

    -m Start mining.

    -c Create account with password of "password"

    -l Check account balances
Examples:
Mining
$0 -m 0x4e3ffc5cda0c98b5e509edd1cc4025aed281d9b3

";
    exit;
}

while getopts "airmlc:" opt; do
  case $opt in
    a)
        echo "attaching" >&2
        METHOD="attach"
    ;;
    i)
        echo "initializing" >&2
        METHOD="init"
    ;;
    r)
        echo "running" >&2
        METHOD="run"
    ;;
    m)
        echo "mining"
        METHOD="mine"
        ACCOUNT="$OPTARG"
    ;;
    c)
        echo "creating account"
        METHOD="create-account"
        PASSWORD="$OPTARG"
    ;;
    l)
        echo "listing accounts"
        METHOD="list-accounts"
    ;;
    h)
        help
    ;;
  esac
done

if [ -z "$METHOD" ]; then
    echo "Error: No method set."
    help
fi

if [ "$METHOD" == "run" ]; then
    ARGS=$BASEARGS
fi

if [ "$METHOD" == "mine" ]; then
    ARGS="$BASEARGS --mine $ACCOUNT"
fi

if [ "$METHOD" == "create-account" ]; then
    echo "$PASSWORD" > $IDENT-password.tmp
    ARGS=" --datadir $DATADIR --password $IDENT-password.tmp account new"
fi

if [ "$METHOD" == "init" ]; then
    ARGS=" --datadir $DATADIR  init $CURDIR/$GENFILE"
fi

if [ "$METHOD" == "attach" ]; then
    ARGS=" --datadir $DATADIR attach ipc:$DATADIR/$IPCPATH "
fi
if [ "$METHOD" == "list-accounts" ]; then
    ARGS=" --datadir $DATADIR account list "
fi

echo $CMD $ARGS

$CMD $ARGS

if [ "$METHOD" == "create-account" ]; then
    rm $IDENT-password.tmp
fi
