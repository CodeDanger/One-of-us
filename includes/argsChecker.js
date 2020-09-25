
module.exports = {
    async fixArgs(cmd,arguments)
    {
        arguments = arguments ? arguments : [];
        
        if(cmd.args && arguments.length<cmd.args.length)
        {
            if (!cmd.opt ){
                
                return false;
            }
            let arr = [];
            let old_val = -1;
            let args_counter = 0;
        
            cmd.opt.forEach((val) => {
                if ((old_val+1)!=val){

                    arr[old_val+1] = arguments[args_counter];
                    args_counter++ ;
                    old_val = old_val+1 ; 
                }
                arr[val] = "";
            });

            delete(args_counter,old_val);
            return arr;
        }
        delete(cmd);
        return arguments;
    }
}