import receiptController from '../../src/controllers/receiptController';
import receiptService from '../../src/services/receiptService';

jest.mock('../../src/services/receiptService');

describe('receiptController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('createNewReceipt', () => {
        // Test case: Tạo phiếu nhập thành công
        test('RM_receiptController_TC_001 [test_handleCreateNewReceipt_success] - should return 200 and data from service', async () => {
            // Giả lập dữ liệu trả về từ service
            const mockData = { errCode: 0, message: 'OK' };
            receiptService.createNewReceipt.mockResolvedValue(mockData);
            req.body = { userId: 1, supplierId: 1, productDetailSizeId: 1, quantity: 10, price: 1000 };

            // Gọi hàm controller
            await receiptController.createNewReceipt(req, res);

            // Kiểm tra các phương thức đã được gọi đúng tham số
            expect(receiptService.createNewReceipt).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        // Test case: Bắt lỗi server khi tạo phiếu nhập thất bại
        test('RM_receiptController_TC_002 [test_handleCreateNewReceipt_error] - should return error from server on exception', async () => {
            // Giả lập lỗi từ service
            receiptService.createNewReceipt.mockRejectedValue(new Error('Test Error'));
            req.body = { userId: 1 };

            // Gọi hàm controller
            await receiptController.createNewReceipt(req, res);

            // Kiểm tra phản hồi trả về mã lỗi 200 và thông báo lỗi server
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                errCode: -1,
                errMessage: 'Error from server'
            });
        });
    });

    describe('getDetailReceiptById', () => {
        // Test case: Lấy chi tiết phiếu nhập thành công
        test('RM_receiptController_TC_003 [test_getDetailReceiptById_success] - should return 200 and data', async () => {
            // Giả lập dữ liệu chi tiết phiếu nhập
            const mockData = { errCode: 0, data: { id: 1 } };
            receiptService.getDetailReceiptById.mockResolvedValue(mockData);
            req.query.id = 1;

            await receiptController.getDetailReceiptById(req, res);

            // Kiểm tra phản hồi trả về
            expect(receiptService.getDetailReceiptById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        // Test case: Bắt lỗi khi lấy chi tiết phiếu nhập
        test('RM_receiptController_TC_003_1 [test_getDetailReceiptById_error] - should return error from server on exception', async () => {
            receiptService.getDetailReceiptById.mockRejectedValue(new Error('Test Error'));
            req.query.id = 1;

            await receiptController.getDetailReceiptById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                errCode: -1,
                errMessage: 'Error from server'
            });
        });
    });

    describe('getAllReceipt', () => {
        // Test case: Lấy danh sách tất cả phiếu nhập thành công
        test('RM_receiptController_TC_004 [test_getAllReceipt_success] - should return 200 and data', async () => {
            // Giả lập danh sách phiếu nhập
            const mockData = { errCode: 0, data: ['receipt1'] };
            receiptService.getAllReceipt.mockResolvedValue(mockData);
            req.query = { limit: 10, offset: 0 };

            await receiptController.getAllReceipt(req, res);

            // Kiểm tra gọi service và phản hồi thành công
            expect(receiptService.getAllReceipt).toHaveBeenCalledWith(req.query);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        // Test case: Bắt lỗi khi lấy danh sách phiếu nhập
        test('RM_receiptController_TC_004_1 [test_getAllReceipt_error] - should return error from server on exception', async () => {
            receiptService.getAllReceipt.mockRejectedValue(new Error('Test Error'));
            req.query = { limit: 10, offset: 0 };

            await receiptController.getAllReceipt(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                errCode: -1,
                errMessage: 'Error from server'
            });
        });
    });

    describe('updateReceipt', () => {
        // Test case: Cập nhật phiếu nhập thành công
        test('RM_receiptController_TC_005 [test_updateReceipt_success] - should return 200 and data', async () => {
            // Giả lập kết quả cập nhật
            const mockData = { errCode: 0, message: 'OK' };
            receiptService.updateReceipt.mockResolvedValue(mockData);
            req.body = { id: 1, supplierId: 2 };

            await receiptController.updateReceipt(req, res);

            // Kiểm tra dữ liệu trả về và hàm được gọi
            expect(receiptService.updateReceipt).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        // Test case: Bắt lỗi khi cập nhật phiếu nhập
        test('RM_receiptController_TC_005_1 [test_updateReceipt_error] - should return error from server on exception', async () => {
            receiptService.updateReceipt.mockRejectedValue(new Error('Test Error'));
            req.body = { id: 1, supplierId: 2 };

            await receiptController.updateReceipt(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                errCode: -1,
                errMessage: 'Error from server'
            });
        });
    });

    describe('deleteReceipt', () => {
        // Test case: Xóa phiếu nhập thành công
        test('RM_receiptController_TC_006 [test_deleteReceipt_success] - should return 200 and data', async () => {
            // Giả lập kết quả xóa
            const mockData = { errCode: 0, message: 'OK' };
            receiptService.deleteReceipt.mockResolvedValue(mockData);
            req.body = { id: 1 };

            await receiptController.deleteReceipt(req, res);

            expect(receiptService.deleteReceipt).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        // Test case: Bắt lỗi khi xóa phiếu nhập
        test('RM_receiptController_TC_006_1 [test_deleteReceipt_error] - should return error from server on exception', async () => {
            receiptService.deleteReceipt.mockRejectedValue(new Error('Test Error'));
            req.body = { id: 1 };

            await receiptController.deleteReceipt(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                errCode: -1,
                errMessage: 'Error from server'
            });
        });
    });

    describe('createNewReceiptDetail', () => {
        // Test case: Tạo chi tiết phiếu nhập thành công
        test('RM_receiptController_TC_007 [test_createNewReceiptDetail_success] - should return 200 and data', async () => {
            // Giả lập kết quả tạo chi tiết phiếu nhập
            const mockData = { errCode: 0, message: 'OK' };
            receiptService.createNewReceiptDetail.mockResolvedValue(mockData);
            req.body = { receiptId: 1, quantity: 5 };

            await receiptController.createNewReceiptDetail(req, res);

            expect(receiptService.createNewReceiptDetail).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        // Test case: Bắt lỗi khi tạo chi tiết phiếu nhập
        test('RM_receiptController_TC_007_1 [test_createNewReceiptDetail_error] - should return error from server on exception', async () => {
            receiptService.createNewReceiptDetail.mockRejectedValue(new Error('Test Error'));
            req.body = { receiptId: 1, quantity: 5 };

            await receiptController.createNewReceiptDetail(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                errCode: -1,
                errMessage: 'Error from server'
            });
        });
    });
});
