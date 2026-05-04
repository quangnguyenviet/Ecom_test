import receiptService from '../../src/services/receiptService';
import db from '../../src/models/index';

jest.mock('../../src/models/index');

describe('receiptService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        db.Receipt = {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            findAndCountAll: jest.fn(),
            destroy: jest.fn(),
        };
        db.ReceiptDetail = {
            create: jest.fn(),
            findAll: jest.fn(),
        };
        db.User = { findOne: jest.fn() };
        db.Supplier = { findOne: jest.fn() };
        db.ProductDetailSize = { findOne: jest.fn() };
        db.ProductDetail = { findOne: jest.fn() };
        db.Product = { findOne: jest.fn() };
        db.Allcode = { findOne: jest.fn() };
    });

    describe('createNewReceipt', () => {
        const mockData = {
            userId: 1,
            supplierId: 1,
            productDetailSizeId: 1,
            quantity: 10,
            price: 1000
        };

        // Test case: Tạo phiếu nhập thành công
        test('RM_receiptService_TC_001 [test_createNewReceipt_success] - should create a new receipt successfully', async () => {
            // Giả lập kết quả trả về từ DB
            db.Receipt.create.mockResolvedValue({ id: 100 });
            db.ReceiptDetail.create.mockResolvedValue({});

            // Gọi hàm service
            const result = await receiptService.createNewReceipt(mockData);

            // Kiểm tra việc gọi DB và kết quả trả về
            expect(db.Receipt.create).toHaveBeenCalledWith({
                userId: mockData.userId,
                supplierId: mockData.supplierId
            });
            expect(db.ReceiptDetail.create).toHaveBeenCalledWith({
                receiptId: 100,
                productDetailSizeId: mockData.productDetailSizeId,
                quantity: mockData.quantity,
                price: mockData.price,
            });
            expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
        });

        // Test case: Báo lỗi khi thiếu tham số đầu vào
        test('RM_receiptService_TC_002 [test_createNewReceipt_missing_params] - should return error if missing required parameters', async () => {
            const incompleteData = { userId: 1 };
            const result = await receiptService.createNewReceipt(incompleteData);
            expect(result).toEqual({ errCode: 1, errMessage: 'Missing required parameter !' });
        });
    });

    describe('createNewReceiptDetail', () => {
        const mockData = {
            receiptId: 100,
            productDetailSizeId: 1,
            quantity: 5,
            price: 500
        };

        // Test case: Tạo chi tiết phiếu nhập thành công
        test('RM_receiptService_TC_003 [test_createNewReceiptDetail_success] - should create receipt detail successfully', async () => {
            db.ReceiptDetail.create.mockResolvedValue({});
            const result = await receiptService.createNewReceiptDetail(mockData);
            expect(db.ReceiptDetail.create).toHaveBeenCalledWith(mockData);
            expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
        });

        // Test case: Báo lỗi khi thiếu tham số tạo chi tiết phiếu nhập
        test('RM_receiptService_TC_004 [test_createNewReceiptDetail_missing_params] - should return error if missing parameters for detail', async () => {
            const result = await receiptService.createNewReceiptDetail({ receiptId: 100 });
            expect(result).toEqual({ errCode: 1, errMessage: 'Missing required parameter !' });
        });
    });

    describe('getDetailReceiptById', () => {
        // Test case: Lấy chi tiết phiếu nhập thành công với đầy đủ thông tin
        test('RM_receiptService_TC_005 [test_getDetailReceiptById_success] - should get detail receipt by ID successfully', async () => {
            const mockReceipt = { id: 1 };
            const mockDetails = [{ id: 1, productDetailSizeId: 10 }];
            const mockProductDetailSize = { id: 10, productdetailId: 20 };
            const mockProductDetail = { id: 20, productId: 30 };
            const mockProduct = { id: 30, name: 'Product A' };

            // Giả lập các lời gọi DB để join thông tin
            db.Receipt.findOne.mockResolvedValue(mockReceipt);
            db.ReceiptDetail.findAll.mockResolvedValue(mockDetails);
            db.ProductDetailSize.findOne.mockResolvedValue(mockProductDetailSize);
            db.ProductDetail.findOne.mockResolvedValue(mockProductDetail);
            db.Product.findOne.mockResolvedValue(mockProduct);

            const result = await receiptService.getDetailReceiptById(1);

            expect(result.errCode).toBe(0);
            expect(result.data.id).toBe(1);
            expect(result.data.receiptDetail[0].productData.name).toBe('Product A');
        });

        // Test case: Báo lỗi khi thiếu ID phiếu nhập
        test('RM_receiptService_TC_006 [test_getDetailReceiptById_missing_id] - should return error if ID is missing', async () => {
            const result = await receiptService.getDetailReceiptById(null);
            expect(result).toEqual({ errCode: 1, errMessage: 'Missing required parameter !' });
        });
    });

    describe('getAllReceipt', () => {
        // Test case: Lấy danh sách phiếu nhập kèm thông tin user và supplier
        test('RM_receiptService_TC_007 [test_getAllReceipt_success] - should get all receipts with user and supplier data', async () => {
            const mockReceipts = {
                rows: [{ id: 1, userId: 1, supplierId: 1 }],
                count: 1
            };
            db.Receipt.findAndCountAll.mockResolvedValue(mockReceipts);
            db.User.findOne.mockResolvedValue({ id: 1, firstName: 'Admin' });
            db.Supplier.findOne.mockResolvedValue({ id: 1, name: 'Supplier A' });

            const result = await receiptService.getAllReceipt({ limit: 10, offset: 0 });

            // Kiểm tra thông tin trả về đã được map đúng
            expect(result.errCode).toBe(0);
            expect(result.data[0].userData.firstName).toBe('Admin');
            expect(result.data[0].supplierData.name).toBe('Supplier A');
            expect(result.count).toBe(1);
        });
    });

    describe('updateReceipt', () => {
        // Test case: Cập nhật thông tin phiếu nhập thành công
        test('RM_receiptService_TC_008 [test_updateReceipt_success] - should update receipt successfully', async () => {
            const mockReceipt = { id: 1, supplierId: 1, save: jest.fn() };
            db.Receipt.findOne.mockResolvedValue(mockReceipt);

            const result = await receiptService.updateReceipt({ id: 1, date: '2023-01-01', supplierId: 2 });

            expect(mockReceipt.supplierId).toBe(2);
            expect(mockReceipt.save).toHaveBeenCalled();
            expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
        });

        // Test case: Báo lỗi khi cập nhật phiếu nhập thiếu tham số
        test('RM_receiptService_TC_009 [test_updateReceipt_missing_params] - should return error if missing parameters for update', async () => {
            const result = await receiptService.updateReceipt({ id: 1 });
            expect(result).toEqual({ errCode: 1, errMessage: 'Missing required parameter !' });
        });
    });

    describe('deleteReceipt', () => {
        // Test case: Xóa phiếu nhập thành công
        test('RM_receiptService_TC_010 [test_deleteReceipt_success] - should delete receipt successfully', async () => {
            db.Receipt.findOne.mockResolvedValue({ id: 1 });
            db.Receipt.destroy.mockResolvedValue(1);

            const result = await receiptService.deleteReceipt({ id: 1 });

            expect(db.Receipt.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
        });

        // Test case: Báo lỗi khi xóa phiếu nhập thiếu ID
        test('RM_receiptService_TC_011 [test_deleteReceipt_missing_id] - should return error if ID is missing for delete', async () => {
            const result = await receiptService.deleteReceipt({});
            expect(result).toEqual({ errCode: 1, errMessage: 'Missing required parameter !' });
        });
    });
});
