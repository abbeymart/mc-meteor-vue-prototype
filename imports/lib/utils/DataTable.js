/**
 * Created by abbeymart on 2017-01-13.
 * Data table function
 * Objects: header items, row values / records, items/page, search section, page counts, prev/next
 * Actions: #items/page(default/selected, search by column / all-columns,
 * Displays: footer (prev / next), 1 to N of Z records
 * Columns/headers: defined by properties/attributes (sort, image-tags/asc-desc... labels/actions)
 */
// import libraries

// Columns: program configured-props and/or html items or defined custom directives (e.g. mc-sort)

// Records per page = N (default or selected)

// A to B of Z records: nil for records(Z) = 0, for records(Z) > 0... calculate A and B (based on default/selected) by page# (i.e. page 1 > 1...N*1, page 2 > N+1... N*2, page 3 > N*2+1... N*3...

// prev / next page link: inactive/no-display for Z <= N, prev inactive on page 1, next inactive on last page, pages = Z/N + 1 (if Rem(Z/N) > 0)

