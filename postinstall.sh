sysOS=`uname -s`
# cur_dir=$(cd `dirname $0`; pwd)
node_modules_dir=./node_modules
if [ $sysOS = "Linux" ];then
   node_modules_dir=node_modules
fi

# cp postinstall/AsyncStorageModule.java $node_modules_dir/@react-native-async-storage/async-storage/android/src/main/java/com/reactnativecommunity/asyncstorage/AsyncStorageModule.java