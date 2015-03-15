 /** @jsx React.DOM */

function offSets(){
    return [[-1,-1], [-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
}

function randChar(){
    return String.fromCharCode(_.random(65, 90));
}

var Game = React.createClass({
    getInitialState: function(){
        return {
            currentWord: "Word",
            selectedCells: [],
            matrix: _.range(6).map(function(n) { return _.range(6).map(function(n) {return randChar()})}),
        }
    },
    componentDidMount: function(){
        var mc = new Hammer(this.refs.canvas.getDOMNode());

        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 1 });

        mc.on("panstart pan ", function(ev) {
            var x = ev.pointers[0].offsetX,
                y = ev.pointers[0].offsetY;
            if(ev.type == "pan" || ev.type == "panstart"){
                console.log([y, x]);
                this.detectCell(x, y, 300);
            }
        }.bind(this));

        mc.on("panend", function(ev){
            console.log(this.currentWord());
            this.setState({"selectedCells": []}, this.renderBoard);
        }.bind(this));

        this.renderBoard();
    },
    currentWord: function(){
        return _.map(this.state.selectedCells, function(cell){
            return this.state.matrix[cell[0]][cell[1]]; 
        }, this).join("");
    },
    detectCell: function(x, y, side){
        var canvas = this.refs.canvas.getDOMNode();

        var tile_size = (side/6);

        var row = Math.floor(y / tile_size);
        var column = Math.floor(x / tile_size);

        var circle_x = tile_size * column + tile_size/2;
        var circle_y = tile_size * row + tile_size/2;

        var dx = Math.abs(x - circle_x);
        var dy = Math.abs(y - circle_y);
        var dis = Math.sqrt(dx*dx + dy*dy);

        context = canvas.getContext("2d");
        context.beginPath();
        context.arc(x, y, 1, 0, 2 * Math.PI, false);
        context.lineWidth = 1;
        context.strokeStyle = 'black';

        var newCoordinate = [row, column];
        var selectedCells = this.state.selectedCells;
        if(dis <= 1*(tile_size/2) && !_.isEqual(selectedCells[selectedCells.length-1], newCoordinate)){
            this.state.selectedCells.push(newCoordinate);
            this.setState({"selectedCells": this.state.selectedCells}, this.renderBoard);
        }
    },
    renderBoard: function(){
        var canvas = this.refs.canvas.getDOMNode();
        context = canvas.getContext("2d");

        context.clearRect(0, 0, 300, 300);

        context.font = "bold 30px sans-serif";
        for(var i=0;i<6;i++){
            for(var j=0;j<6;j++){
                var letter = this.state.matrix[i][j];

                tile_style =  _.any(this.state.selectedCells, function(cell){ return _.isEqual(cell, [i, j])})  ? 'white' : 'red';
                letter_style =  _.any(this.state.selectedCells, function(cell){ return _.isEqual(cell, [i, j])})  ? 'black' : 'white';

                context.fillStyle = tile_style;
                context.fillRect(j*50+4, i*50+4, 50-8, 50-8);

                if(letter){
                    context.fillStyle = letter_style;
                    context.beginPath();
                    context.fillText(letter, 50*j+15, 50*(i+1)-15);
                    context.stroke();
                }
            }
        }
    },
    render: function(){
        return (
            <div>
                <canvas ref="canvas" id="myElement" width="300" height="300"></canvas>
                <div id="word_marker">{this.currentWord()}</div>
            </div>
        )
    }
})
 
React.render(<Game />, document.getElementById("container"));
