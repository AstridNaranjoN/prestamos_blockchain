#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
./stopFabric.sh

# como el iptables se bajó después de levantar el docker saca un error, por eso hay que reiniciar el docker y el iptables
systemctl stop docker
systemctl stop iptables
systemctl start iptables
systemctl start docker

# levanter el hyperledger
./startFabric.sh 

# bajar el iptables para que la aplicación web rest sea accesible desde internet
systemctl stop iptables


echo "Proceso finalizado. Por favor reinicie la aplicación web rest prestamosbc"


