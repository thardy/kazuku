(function() {
    // First, check if it isn't implemented yet.
    if (!Array.prototype.contains) {
        Array.prototype.contains = function(element){
            return this.indexOf(element) > -1;
        };
    }
})(module.exports);