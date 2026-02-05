package com.br.kondor.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class SchemaFixerRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> NUCLEAR SCHEMA FIXER STARTING <<<");

        // 0. Diagnostic: Check specific tables
        diagnoseTable("news");
        diagnoseTable("tickets");

        // 1. Auto-detect all BYTEA columns (exclude system schemas)
        String sqlAllBytea = "SELECT table_schema, table_name, column_name FROM information_schema.columns " +
                "WHERE data_type = 'bytea' " +
                "AND table_schema NOT IN ('information_schema', 'pg_catalog')";
        List<Map<String, Object>> byteaColumns = jdbcTemplate.queryForList(sqlAllBytea);

        if (byteaColumns.isEmpty()) {
            System.out.println(">>> No BYTEA columns detected. Schema looks clean.");
        } else {
            for (Map<String, Object> col : byteaColumns) {
                String schema = (String) col.get("table_schema");
                String table = (String) col.get("table_name");
                String column = (String) col.get("column_name");

                if (table == null || column == null)
                    continue;

                String fullPath = (schema != null ? schema + "." : "") + table + "." + column;
                System.out.println("!!! AUTO-DETECTED BYTEA: " + fullPath);

                // 2. Determine target type
                String targetType = "TEXT";
                String lowerCol = column.toLowerCase();
                if (lowerCol.contains("date") || lowerCol.endsWith("_at")) {
                    targetType = "TIMESTAMP";
                } else if (lowerCol.equals("active") || lowerCol.equals("shared")
                        || lowerCol.equals("anonymous") || lowerCol.equals("highlighted")
                        || lowerCol.equals("whatsapp") || lowerCol.equals("emergency")
                        || lowerCol.equals("is_emergency")) {
                    targetType = "BOOLEAN";
                } else if (lowerCol.equals("title") || lowerCol.equals("name") || lowerCol.equals("role")
                        || lowerCol.equals("phone_number") || lowerCol.equals("phone")) {
                    targetType = "VARCHAR(500)";
                }

                // 3. Apply Fix
                try {
                    System.out.println(">>> Attempting to FIX " + fullPath + " to " + targetType);
                    String castExpression;
                    if (targetType.equals("BOOLEAN")) {
                        castExpression = "(convert_from(" + column + ", 'UTF8') = 'true')";
                    } else if (targetType.equals("TIMESTAMP")) {
                        castExpression = "convert_from(" + column + ", 'UTF8')::timestamp";
                    } else {
                        castExpression = "convert_from(" + column + ", 'UTF8')";
                    }

                    String alterSql = String.format("ALTER TABLE %s.%s ALTER COLUMN %s TYPE %s USING %s",
                            schema, table, column, targetType, castExpression);

                    if (alterSql != null) {
                        jdbcTemplate.execute(alterSql);
                        System.out.println(">>> SUCCESSFULLY FIXED " + fullPath);
                    }
                } catch (Exception e) {
                    System.err.println(">>> FAILED TO FIX " + fullPath + ": " + e.getMessage());
                    try {
                        System.out.println(">>> Attempting fallback simple cast for " + fullPath);
                        String simpleAlter = String.format("ALTER TABLE %s.%s ALTER COLUMN %s TYPE %s", schema, table,
                                column, targetType);
                        if (simpleAlter != null) {
                            jdbcTemplate.execute(simpleAlter);
                            System.out.println(">>> Fallback success!");
                        }
                    } catch (Exception ex) {
                        System.err.println(">>> Fallback failed: " + ex.getMessage());
                    }
                }
            }
        }
        System.out.println(">>> NUCLEAR SCHEMA FIXER FINISHED <<<");
    }

    private void diagnoseTable(String tableName) {
        try {
            System.out.println("--- DIAGNOSING TABLE: " + tableName + " ---");
            String sql = "SELECT table_schema, column_name, data_type FROM information_schema.columns WHERE table_name = ?";
            List<Map<String, Object>> columns = jdbcTemplate.queryForList(sql, tableName);
            if (columns.isEmpty()) {
                System.out.println("No columns found for table: " + tableName);
            } else {
                for (Map<String, Object> col : columns) {
                    System.out.println(String.format("  [%s] %s: %s",
                            col.get("table_schema"), col.get("column_name"), col.get("data_type")));
                }
            }
        } catch (Exception e) {
            System.err.println("Error diagnosing table " + tableName + ": " + e.getMessage());
        }
    }
}
