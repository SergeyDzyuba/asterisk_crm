DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "$DIR"
while true
do
    if [ "`ps ax|grep pamicel.php|grep -v grep`" ] 
    then
        sleep 2
    else
        nohup php pamicel.php
    fi
done