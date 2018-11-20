getPath = WScript.Arguments.Named("filename") 'gets the path from the variable passed from bat file

set fso = CreateObject("Scripting.FileSystemObject")
set my_folder = fso.getFolder(getPath)'gets the folder obj

Dim objExcel
Set objExcel = CreateObject("Excel.Application")   'creates an excel application

For Each file In my_folder.Files   'gets each file in the folder
    strFileExt = FSO.GetExtensionName(file)
    If strFileExt = "xls" Then   'check for .xls files
        
        With objExcel
            .Workbooks.Open(file) 
            if objExcel.Sheets.Count = 2 Then   'sheet count = 2 is the Products table     
                .Sheets(1).Select    
                .Range("M1").Value = "Supplier_Color"
                .Range("N1").Value = "Package_Style"
                .Range("U1").Value = "Number_of_Positions"
                .Range("X1").Value = "Target_Inventory"
                .Range("Z1").Value = "Peg_Span"
                .Range("AA1").Value = "Peghole_X"
                .Range("AB1").Value = "Peghole_Y"
                .Range("AC1").Value = "Shape_ID"
                .Range("AD1").Value = "Annual_Movement"
                .Range("AE1").Value = "Annual_Profit"
                .Range("AF1").Value = "Capacity_Cost"
                .Range("AG1").Value = "Capacity_Retail"
                .Range("AH1").Value = "Case_Cost"
                .Range("AI1").Value = "Days_Supply"
                .Range("AN1").Value = "ROII_Cost"
                .Range("AO1").Value = "ROII_Retail"
                .Range("AR1").Value = "Unit_Cost"
                .Range("AS1").Value = "Unit_Movement"
                .Range("AT1").Value = "Unit_Profit"
                .Range("AV1").Value = "Desc_1"
                .Range("AW1").Value = "Desc_2"
                .Range("AX1").Value = "Desc_3"
                .Range("AY1").Value = "Desc_4"
                .Range("AZ1").Value = "Desc_5"
                .Range("BA1").Value = "Desc_6"
                .Range("BB1").Value = "Desc_7"
                .Range("BC1").Value = "Desc_8"
                .Range("BD1").Value = "Desc_9"
                .Range("BE1").Value = "Desc_10"
                .Range("BF1").Value = "Flag_1"
                .Range("BG1").Value = "Flag_2"
                .Range("BH1").Value = "Flag_3"
                .Range("BI1").Value = "Value_1"
                .Range("BJ1").Value = "Value_2"
                .Range("BK1").Value = "Value_3"
                .Range("BL1").Value = "Value_4"
                .Range("BM1").Value = "Value_5"
                .Range("BN1").Value = "Value_6"
                .Range("BO1").Value = "Value_7"
                .Range("BP1").Value = "Value_8"
                .Range("BQ1").Value = "Value_9"
                .Range("BR1").Value = "Value_10"
                .ActiveWorkbook.SaveAs objExcel.ActiveWorkbook.Path + "\Product.csv", 6 ', -4158  ' saves it as Products.txt

                .Activeworkbook.Close SaveChanges=False
            

            Elseif objExcel.Sheets.Count = 3 Then   'sheets = 3 is Posotions table
            .Sheets(1).Select
            .Sheets(1).Rows("1:1").Insert xlDown, xlFormatFromLeftOrAbove
            .Range("A1").Value = "Sl_No."
            .Range("B1").Value = "No."
            .Range("C1").Value = "Name"
            .Range("D1").Value = "Width"
            .Range("E1").Value = "Segments"	
            .Activeworkbook.SaveAs objExcel.ActiveWorkbook.Path + "\Planogram.csv", 6   ',-4158
        
        
            .Sheets(2).Select
            .Sheets(2).Rows("1:1").Insert xlDown, xlFormatFromLeftOrAbove
            .Range("A1").Value = "Sl_No."
            .Range("B1").Value = "Planogram_No."
            .Range("C1").Value = "Shelf"
            .Range("D1").Value = "Shelf_No."
            .Range("E1").Value = "Height"
            .Range("F1").Value = "Width"
            .Range("G1").Value = "Depth"
            .Range("H1").Value = "Shelf_Name"
            .Activeworkbook.SaveAs objExcel.ActiveWorkbook.Path + "\Fixture.csv", 6    ',-4158
        
            .Sheets(3).Select
            .Range("E1").Value = "Location_ID"
            .Range("Q1").Value = "Full_Height"
            .Range("R1").Value = "Full_Width"
            .Range("S1").Value = "Full_Depth"
            .Range("I1").Value = "Display/Unit"
            .Columns("J:K").Delete xlToLeft
            .Activeworkbook.SaveAs objExcel.ActiveWorkbook.Path + "\Position.csv", 6     ',-4158

            .Activeworkbook.Close SaveChanges=False
            
            
            Elseif objExcel.Sheets.Count = 4 Then   'sheets number = 4 is Performance table
            Dim erow, sl_no
            Const xlUp = -4162
            .Sheets(2).Select
            erow = .Cells(.Rows.Count, 1).End(xlUp).Offset(1, 0).Row
            .Columns("C:C").NumberFormat = "@" 'seeting the format of cell as text
            .Range("C1").Value = "UPC"
            For i = 2 To (erow - 1)
                sl_no = .Cells(i, 2).Value
                .Cells(i, 3).Value = .Sheets(1).Cells(sl_no, 2).Text
            Next
            .Range("D1").Value = "On_Planogram"
            .Range("K1").Value = "ROII_Cost"
            .Range("L1").Value = "ROII_Retail"
            .ActiveWorkbook.SaveAs objExcel.ActiveWorkbook.Path + "\Performance.csv", 6     ', -4158

            .Activeworkbook.Close SaveChanges=False
            
            End If

        End With

    End If

Next
objExcel.Quit
' -----------------------------------------------------------------
' just keeping below copy to clipboard code for future reference
' ----------------------------------------------------------------
' Set WshShell = WScript.CreateObject("WScript.Shell") 
' WshShell.Run "cmd.exe /c echo " & getPath & " | clip", 0, TRUE
' ------------------------------------------------------------------