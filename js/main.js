jQuery(document).ready(function($) {
    var table;
    var numberView = function(input, decimalDelimiter, thousandDelimiter) {
        var number, formattedNumber, mathFloor, decimalPart, module;
        number = parseFloat(input, 10);
        if (isNaN(number)) {
            return input;
        }
        formattedNumber = '';
        mathFloor = Math.floor((number - Math.floor(number)) * 10)
        decimalPart = decimalDelimiter + mathFloor;
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
            if (formattedNumber) {
                formattedNumber = thousandDelimiter + module + formattedNumber;
            } else {
                formattedNumber = module;
            }
            number = Math.floor(number / 1000);
        }
        formattedNumber = number + thousandDelimiter + formattedNumber +
            decimalPart;
        return formattedNumber;
    };
    var formattedNumberView = function(number) {
        return numberView(number, '.', ',');
    };
    var drawTable = function(tableData) {
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
                sInfo: 'Ցուցադրված են _START_-ից _END_ արդյունքները ' +
                    'ընդհանուր _TOTAL_-ից',
                sInfoEmpty: 'Արդյունքներ գտնված չեն',
                sInfoPostFix: '',
                oAria: {
                    sSortAscending: ': ակտիվացրեք աճման կարգով դասավորելու ' +
                        'համար',
                    sSortDescending: ': ակտիվացրեք նվազման կարգով ' +
                        'դասավորելու համար'
                }
            },
            columns: [{
                title: 'Գնման ենթակա  ապրանքներ, աշխատանքներ և ծառայություններ'
            }, {
                title: 'Գնման առարկան'
            }, {
                title: 'Չափման միավորը',
                sClass: 'text-center'
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
                visible: true,
                targets: 1
            }, {
                visible: true,
                targets: 2
            }, {
                visible: true,
                targets: 3,
                render: formattedNumberView
            }, {
                visible: true,
                targets: 4,
                render: formattedNumberView
            }, {
                visible: true,
                targets: 5
            }],
            order: [
                [0, 'asc']
            ],
            displayLength: 25,
            drawCallback: function(settings) {
                var api, rows, last, amount;
                api = this.api();
                rows = api.rows({
                    page: 'current'
                }).nodes();
                last = null;
                api.column(0, {
                    page: 'current'
                }).data().each(function(group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class=\'group\'><td colspan=\'5\'>' + group +
                            '</td></tr>'
                        );
                        last = group;
                    }
                });
            }
        });
        $('#example tbody').on('click', 'tr.group', function() {
            var currentOrder = table.order()[0];
            if (currentOrder[0] === 0 && currentOrder[1] === 'asc') {
                table.order([0, 'desc']).draw();
            } else {
                table.order([0, 'asc']).draw();
            }
        });
    }
    var tableData = dataSet[0].nodes;
    drawTable(tableData[0].nodes);
    $('#tree').treeview({
        data: tree,
        levels: 1,
        expandIcon: 'glyphicon glyphicon-triangle-right',
        collapseIcon: 'glyphicon glyphicon-triangle-bottom',
        onNodeSelected: function(event, data) {
            var tmp;
            tmp = dataSet.filter(function(el) {
                return el.parent == data.text
            });
            if (tmp.length) {
                table.destroy();
                $('#example tbody').remove();
                drawTable(tmp[0].nodes);
            }
        }
    });
    $('#tree').treeview('selectNode', 0);
    $('#tree').treeview('expandNode', [0, {
        levels: 1
    }]);
});
