DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "$DIR"
while true
do
    if [ "`ps ax|grep app.js|grep -v grep`" ] 
    then
        sleep 2
    else
        nohup node app.js
    fi
done
