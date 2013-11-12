define(['./block'], function (b) {

	var Block = b.begets({
		inits: [
			function () {

			}
		]
		/**
		 *
		 *
		 */
		,toElement: function () {

		}
		
		/**
				@overrides
		 *	#toStrung
		 *	This is to do type checking
		 * 	todo: see if we even actually need this?
		 */
		,toString: function () {
			return '[object Block]'
		}

		/**
		 *
		 *
		 */
		,render: function () {
			var html = b.prototype.render.call(this)
			
		}

	})

	return Block
})