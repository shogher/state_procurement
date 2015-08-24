jQuery(document).ready(function($) {
    var table;
    var numberView = function (input, decimalDelimiter, thousandDelimiter) {
        var number, formatedNumber, decimalPart, module;
        number = input.replace(',', '.');
        number = parseFloat(number, 10);
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
        var item, itemNode, nodeText;
        for (item in tree) {
            for (itemNode in tree[item].nodes) {
                nodeText = tree[item].nodes[itemNode];
                nodeText.text = nodeText.branch + '  ' + numberView(nodeText.sum, '.', ',');
            }
        }
        return tree;
    };

    function drawTable(tableData) {
        table = $('#example').DataTable({
            data: tableData,
            paging: false,
            language: {
                decimal: '.',
                thousands: ',',
                sEmptyTable: 'Տվյալները բացակայում են',
                sProcessing: 'Կատարվում է...',
                sInfoThousands: ',',
                sLoadingRecords: 'Բեռնվում է ...',
                sZeroRecords: 'Հարցմանը համապատասխանող արդյունքներ չկան',
                sInfo: 'Ցուցադրված են _START_-ից _END_ արդյունքները ընդհանուր _TOTAL_-ից',
                sInfoEmpty: 'Արդյունքներ գտնված չեն',
                sInfoFiltered: '(ֆիլտրվել է ընդհանուր _MAX_ արդյունքներից)',
                sInfoPostFix: '',
                sSearch: 'Փնտրել',
                oAria: {
                    sSortAscending: ': ակտիվացրեք աճման կարգով դասավորելու համար',
                    sSortDescending: ': ակտիվացրեք նվազման կարգով դասավորելու համար'
                }
            },
            columns: [{
                title: 'Գնման ենթակա  ապրանքներ, աշխատանքներ և ծառայությունների խմբեր'
            }, {
                title: 'Գնման ենթակա  ապրանքներ, աշխատանքներ և ծառայությունների խմբեր(գումարը)'
            }, {
                title: 'Գնման ենթակա ապրանքներ, աշխատանքներ և ծառայություններ'
            }, {
                title: 'Չափման միավորը'
            }, {
                title: 'Ամբողջ քանակը (ծավալը)',
                sClass: 'text-right'
            }, {
                title: 'Գումարը',
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
                visible: true,
                targets: 2
            }, {
                visible: true,
                targets: 5,
                render: formattedNumberView
            }, {
                visible: true,
                targets: 4,
                render: formattedNumberView
            }],
            order: [
                [0, 'asc']
            ],
            displayLength: 25,
            drawCallback: function (settings) {
                var api, rows, last, amount;
                api = this.api();
                rows = api.rows({
                    page: 'current'
                }).nodes();
                last = null;
                api.column(0, {
                    page: 'current'
                }).data().each(function (group, i) {
                    amount = api.rows({
                        page: 'current'
                    }).data()[i][1];
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class=\'group\'><td colspan=\'3\'>' + group +
                            '<td colspan=\'1\'>' + formattedNumberView(amount) + '<td colspan=\'1\'></td></td></td></tr>'
                        );
                        last = group;
                    }
                });
            }
        });
        $('#example tbody').on('click', 'tr.group', function () {
            var currentOrder = table.order()[0];
            if (currentOrder[0] === 0 && currentOrder[1] === 'asc') {
                table.order([0, 'desc']).draw();
            } else {
                table.order([0, 'asc']).draw();
            }
        });
    }
    var tableData = dataSet[0];
    drawTable(tableData);
    $('#tree').treeview({
        data: initTree(tree),
        levels: 1,
        expandIcon: 'glyphicon glyphicon-triangle-right',
        collapseIcon: 'glyphicon glyphicon-triangle-bottom',
        onNodeSelected: function (event, data) {
            var item, nodes, nodesText;
            $('#example, #details, #example_wrapper').empty();
            if (data && data.id !== undefined) {
                table.destroy();
                drawTable(dataSet[data.id]);
                $('#details').removeClass('details-background');
            } else {
                nodes = data.nodes;
                nodesText = '';
                for (item in nodes) {
                    nodesText += '<h5>' + nodes[item].text + '</h6>';
                }
                $('#details').addClass('details-background').html(nodesText);
            }
        }
    });
    $('#tree').treeview('selectNode', 1);
    $('#tree').treeview('expandNode', [0, {
        levels: 1
    }]);
});
