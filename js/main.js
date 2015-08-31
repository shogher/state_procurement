jQuery(document).ready(function($) {
    var table;
    var numberView = function (input, decimalDelimiter, thousandDelimiter) {
        var number, formatedNumber, decimalPart, module;
        number = parseFloat(input, 10);
        if (isNaN(number)) {
            return input;
        }
        formatedNumber = '';
        decimalPart = decimalDelimiter + Math.floor((number - Math.floor(number)) * 10);
        number = number - (number % 1);
        if (number < 1000) {
            return number + decimalPart;
        }
        while (number >= 1000) {
            module = number % 1000;
            if (module >= 0 && module <= 9) {
                module = '00' + module;
            } else if (module >= 10 && module <= 99) {
                module = '0' + module;
            }
            if (formatedNumber) {
                formatedNumber = thousandDelimiter + module + formatedNumber;
            } else {
                formatedNumber = module;
            }
            number = Math.floor(number / 1000);
        }
        formatedNumber = number + thousandDelimiter + formatedNumber + decimalPart;
        return formatedNumber;
    };
    var formattedNumberView = function (number) {
        return numberView(number, '.', ',');
    };
    var initTree = function (tree) {
	var tree = [];
	for (i in k) {
	    if (k[i][1] === "") {
		nodes = [];
		for (j in k) {
		    if (k[j][0] == k[i][0] && k[j][1] !== "" ) {
			nodes.push({
			    text: k[j][1]
			})
		    }
		}
	tmp = {text: k[i][0]};
	if(nodes.length){
		tmp.nodes =  nodes
	}
		tree.push(tmp)

	    }
	}

        return tree;
    };
    function drawTable(tableData) {
        table = $('#example').DataTable({
            data: tableData,
            paging: false,
			bFilter: false,
            language: {
                decimal: '.',
                thousands: ',',
                sEmptyTable: 'Տվյալները բացակայում են',
                sProcessing: 'Կատարվում է...',
                sInfoThousands: ',',
                sLengthMenu: 'Ցուցադրել _MENU_ արդյունքներ մեկ էջում',
                sLoadingRecords: 'Բեռնվում է ...',
                sZeroRecords: 'Հարցմանը համապատասխանող արդյունքներ չկան',
                sInfo: 'Ցուցադրված են _START_-ից _END_ արդյունքները ընդհանուր _TOTAL_-ից',
                sInfoEmpty: 'Արդյունքներ գտնված չեն',
                sInfoFiltered: '(ֆիլտրվել է ընդհանուր _MAX_ արդյունքներից)',
                sInfoPostFix: '',
                sSearch: 'Փնտրել',
                oPaginate: {
                    sFirst: 'Առաջին էջ',
                    sPrevious: 'Նախորդ էջ',
                    sNext: 'Հաջորդ էջ',
                    sLast: 'Վերջին էջ'
                },
                oAria: {
                    sSortAscending: ': ակտիվացրեք աճման կարգով դասավորելու համար',
                    sSortDescending: ': ակտիվացրեք նվազման կարգով դասավորելու համար'
                }
            },
            columns: [{
                title: 'Պետական կառավարման մարմին'
            }, {
                title: ''
            }, {
                title: 'Գնման ենթակա  ապրանքներ, աշխատանքներ և ծառայություններ'
            }, {
                title: 'Գնման առարկան'
            }, {
                title: 'Չափման միավորը'
            }, {
                title: 'Ամբողջ քանակը (ծավալը)',
                sClass: 'text-right'
            }, {
                title: 'Ընդհանուր գումարը (հազ. դրամով)',
                sClass: 'text-right'
            }, {
                title: 'Գնման ձևը (ընթացակարգը)',
                sClass: 'text-right'
            }],
            columnDefs: [{
                visible: false,
                targets: 0
            }, {
                visible: false,
                targets: 1
            }, {
                visible: false,
                targets: 2
            }, {
                visible: true,
                targets: 3
            }, {
                visible: true,
                targets: 4
            }, {
                visible: true,
                targets: 5,
                render: formattedNumberView
            }, {
                visible: true,
                targets: 6,
                render: formattedNumberView
            }, {
                visible: true,
                targets: 7
            }],
            order: [
                [2, 'asc']
            ],
            displayLength: 25,
            drawCallback: function (settings) {
                var api, rows, last, amount;
                api = this.api();
                rows = api.rows({
                    page: 'current'
                }).nodes();
                last = null;
                api.column(2, {
                    page: 'current'
                }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class=\'group\'><td colspan=\'7\'>' + group +
                           '</td></tr>'
                        );
                        last = group;
                    }
                });
            }
        });
        $('#example tbody').on('click', 'tr.group', function () {
            var currentOrder = table.order()[0];
            if (currentOrder[0] === 2 && currentOrder[1] === 'asc') {
                table.order([2, 'desc']).draw();
            } else {
                table.order([2, 'asc']).draw();
            }
        });
    }
    var tableData = dataSet.filter(function(el){return el[0] == "Արցախի ներդրումային հիմնադրամ"});
    drawTable(tableData);
    $('#tree').treeview({
        data: initTree(tree),
        levels: 1,
        expandIcon: 'glyphicon glyphicon-triangle-right',
        collapseIcon: 'glyphicon glyphicon-triangle-bottom',
	      onNodeSelected: function (event, data) {
            var item, nodes, nodesText, tmp;
		tmp = dataSet.filter(function(el){return el[0] == data.text})
            if (tmp.length) {
                table.destroy();
        		$('#example tbody').remove();
    		    drawTable(tmp);
            } 
       	}
    });
    $('#tree').treeview('selectNode', 0);
    $('#tree').treeview('expandNode', [0, {
        levels: 1
}]);
});
