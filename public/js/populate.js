define([
    "dataService",
    'text!templates/main/selectTemplate.html'
],
       function (dataService, selectTemplate) {
		   var dataFormServer = {}
		   // arr= {url:..., data:...}
		   var populateAll = function(el,arr,isCreate){
			   var n = arr.length;
			   for(var i=0;i<n;i++){
				   this.populate(arr[i].url, arr[i].data, function(data){
					   if (arr[i].url=="/WorkflowsForDd"){
						   
						   el.trigger('incomingData', {url:arr[i].url, data:data});
						   var wNames = $.map(data, function (item) {
							   return item.wName;
						   });
						   wNames = _.uniq(wNames);
						   dataFromServer["workflow"] = wNames
					   } else{
						   dataFromServer[arr[i].url] = data
					   }
				   })
				   
			   }

		   };
		   var get = function (id, url, data, field, content, isCreate) {
			   dataService.getData(url, data, function (response) {
				   content.responseObj[id] = _.map(response.data,function(item){
					   return {_id:item._id, name: item[field]}
				   });
				   if (isCreate){
					   $(id).text(content.responseObj[id][0].name).attr("data-id",content.responseObj[id][0]._id)
				   }
			   });
		   };

		   var getPriority = function (id, content, isCreate) {
			   dataService.getData("/Priority", {}, function (response) {
				   console.log(response);
				   content.responseObj[id] = _.map(response.data,function(item){
					   return {_id:item.priority, name: item.priority}
				   });
				   if (isCreate){
					   $(id).text(content.responseObj[id][2].name).attr("data-id",content.responseObj[id][2]._id)
				   }

			   });
		   };

		   var getWorkflow = function (id1, id2 , url, data, field, content, isCreate) {
			   dataService.getData(url, data, function (response) {
				   content.responseObj[id1] = _.map(response.data,function(item){
					   return {_id:item._id, name: item[field]}
				   });
				   var wNames = $.map(response.data, function (item) {
					   return item.wName
				   });
				   wNames = _.uniq(wNames);
				   content.responseObj[id2] = $.map(wNames, function (wName) {
					   return {_id:wName, name: wName}
				   });

				   if (isCreate){
					   $(id1).text(content.responseObj[id1][0].name).attr("data-id",content.responseObj[id1][0]._id)
					   $(id2).text(content.responseObj[id2][0].name).attr("data-id",content.responseObj[id2][0]._id)
				   }
			   });
		   };

		   var get2name = function (id, url, data, content,isCreate) {
			   dataService.getData(url, data, function (response) {
				   content.responseObj[id] = _.map(response.data,function(item){
					   return {_id:item._id, name: item.name.first+" "+item.name.last}
				   });
				   if (isCreate){
					   $(id).text(content.responseObj[id][0].name).attr("data-id",content.responseObj[id][0]._id)
				   }
			   });
		   };
		   var showSelect = function(e,prev,next,context){
			   data = context.responseObj["#"+$(e.target).attr("id")];
			   var elementVisible = 25;
			   var newSel = $(e.target).parent().find(".newSelectList");
			   if (prev||next){
				   newSel = $(e.target).closest(".newSelectList");
				   data = context.responseObj["#"+newSel.parent().find(".current-selected").attr("id")];
			   }
			   var parent = newSel.length>0?newSel.parent():$(e.target).parent();
               var currentPage = 1;
               if (newSel.length&&newSel.is(":visible")&&!prev&&!next){
                   newSel.hide();
				   return;
			   }
			   $(".newSelectList").hide();
			   if ((prev||next)&&newSel.length){
                   currentPage = newSel.data("page");
				   newSel.remove();
			   }
			   else
                   if (newSel.length){
                       newSel.show();
					   return;
                   }
			   if (prev)currentPage--;
			   if (next)currentPage++;
               var s="<ul class='newSelectList' data-page='"+currentPage+"'>";
               var start = (currentPage-1)*elementVisible;
               var end = Math.min(currentPage*elementVisible,data.length);
			   var allPages  = Math.ceil(data.length/elementVisible)
               parent.append(_.template(selectTemplate, { collection: data.slice(start,end), currentPage:currentPage, allPages: allPages, start:start, end:end, dataLength:data.length, elementVisible:elementVisible }));
           };

		   return {
			   populateAll:populateAll,
			   get: get,
			   get2name: get2name,
			   getPriority:getPriority,
			   getWorkflow:getWorkflow,
			   showSelect: showSelect
		   }
       });
