<!--
tableColumns 为表格的列字段属性  按展示顺序放
 -->
<template>
    <vxe-table
      border
      resizable
      height="300"
      :scroll-y="{ enabled: false }"
      :span-method="mergeRowMethod"
      :data="tableData3"
    >
      <vxe-table-column type="seq" width="60"></vxe-table-column>
      <vxe-table-column field="key" title="Key"></vxe-table-column>
      <vxe-table-column field="content" title="content"></vxe-table-column>
      <vxe-table-column field="desc" title="desc"></vxe-table-column>
      <vxe-table-column field="desc2" title="desc2"></vxe-table-column>
    </vxe-table>
</template>

<script>
import Vue from "vue";
import "xe-utils";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";

Vue.use(VXETable);
import $ from "jquery";
export default {
  name: "self-vxe-table",
  data() {
    return {
      tableData3: [
        { id: 10001, key: "中文", content: "名称1", desc: "112", desc2: "123" },
        { id: 10002, key: "中文", content: "名称1", desc: "12", desc2: "123" },
        { id: 10003, key: "中文2", content: "名称1" , desc: "12", desc2: "12"},
        { id: 10003, key: "中文2", content: "名称1" , desc: "22", desc2: "12"},
        { id: 10003, key: "中文2", content: "名称1" , desc: "12", desc2: "123"},
      ],
      tableColumns: ['id', 'key', 'content', 'desc', 'desc2']
    };
  },
  methods: {
    // 通用行合并函数（将相同多列数据合并为一行）
    mergeRowMethod({ row, _rowIndex, column, visibleData }) {
      const fields = ["key", "content", 'desc', 'desc2'];
      const cellValue = row[column.property];
      if (cellValue && fields.includes(column.property)) {
        const prevRow = visibleData[_rowIndex - 1];
        let nextRow = visibleData[_rowIndex + 1];
        
        let index = this.tableColumns.indexOf(column.property);
        const prevColumns = this.tableColumns[index - 1];
        const prevCellValue = row[prevColumns];

        let flag1 = true;
        for(let i=0; i < index; i++) {
          const prevColumns2 = this.tableColumns[i];
          const prevCellValue2 = row[prevColumns2];
          if(prevRow && prevRow[prevColumns2] !== prevCellValue2 && prevColumns2 !==undefined) {
            flag1 = flag1 && false;
          }
        }
        if (prevRow && prevRow[column.property] === cellValue && (flag1  || prevColumns === undefined)) {
          return { rowspan: 0, colspan: 0 };
        } 
        else {
          let countRowspan = 1;
          while (nextRow && nextRow[column.property] === cellValue && (nextRow[prevColumns] === prevCellValue || prevColumns === undefined)) {
            let flag2 = true;
            for(let i=0; i < index; i++) {
              const prevColumns2 = this.tableColumns[i];
              const prevCellValue2 = row[prevColumns2];
              if(nextRow && nextRow[prevColumns2] !== prevCellValue2 && prevColumns2 !==undefined) {
                flag2 = flag2 && false;
              }
            }
            if (flag2) {
              nextRow = visibleData[++countRowspan + _rowIndex];
            } else {
              nextRow = undefined;
            }
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    },
  },
};
</script>

