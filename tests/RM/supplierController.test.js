import supplierController from '../../src/controllers/supplierController';
import supplierService from '../../src/services/supplierService';

jest.mock('../../src/services/supplierService');

describe('supplierController', () => {
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

    describe('createNewSupplier', () => {
        // Test case: Tạo nhà cung cấp thành công
        test('RM_supplierController_TC_008 [test_handleCreateNewSupplier_success] - should return 200 and success data', async () => {
            const mockRes = { errCode: 0, message: 'ok' };
            supplierService.createNewSupplier.mockResolvedValue(mockRes);
            req.body = { name: 'S1' };

            await supplierController.createNewSupplier(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRes);
        });

        // Test case: Bắt lỗi khi tạo nhà cung cấp thất bại
        test('RM_supplierController_TC_009 [test_handleCreateNewSupplier_error] - should return error from server on failure', async () => {
            supplierService.createNewSupplier.mockRejectedValue(new Error('fail'));
            await supplierController.createNewSupplier(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    describe('getDetailSupplierById', () => {
        // Test case: Lấy chi tiết nhà cung cấp thành công
        test('RM_supplierController_TC_010 [test_getDetailSupplierById_success] - should return 200 and supplier data', async () => {
            const mockRes = { errCode: 0, data: { id: 1 } };
            supplierService.getDetailSupplierById.mockResolvedValue(mockRes);
            req.query.id = 1;

            await supplierController.getDetailSupplierById(req, res);

            expect(res.json).toHaveBeenCalledWith(mockRes);
        });

        // Test case: Bắt lỗi khi lấy chi tiết nhà cung cấp
        test('RM_supplierController_TC_010_1 [test_getDetailSupplierById_error] - should return error from server on exception', async () => {
            supplierService.getDetailSupplierById.mockRejectedValue(new Error('fail'));
            await supplierController.getDetailSupplierById(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    describe('getAllSupplier', () => {
        // Test case: Lấy danh sách tất cả nhà cung cấp thành công
        test('RM_supplierController_TC_011 [test_getAllSupplier_success] - should return 200 and all suppliers', async () => {
            const mockRes = { errCode: 0, data: [] };
            supplierService.getAllSupplier.mockResolvedValue(mockRes);
            await supplierController.getAllSupplier(req, res);
            expect(res.json).toHaveBeenCalledWith(mockRes);
        });

        // Test case: Bắt lỗi khi lấy danh sách nhà cung cấp
        test('RM_supplierController_TC_011_1 [test_getAllSupplier_error] - should return error from server on exception', async () => {
            supplierService.getAllSupplier.mockRejectedValue(new Error('fail'));
            await supplierController.getAllSupplier(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    describe('updateSupplier', () => {
        // Test case: Cập nhật thông tin nhà cung cấp thành công
        test('RM_supplierController_TC_012 [test_updateSupplier_success] - should return 200 and update result', async () => {
            const mockRes = { errCode: 0, message: 'ok' };
            supplierService.updateSupplier.mockResolvedValue(mockRes);
            await supplierController.updateSupplier(req, res);
            expect(res.json).toHaveBeenCalledWith(mockRes);
        });

        // Test case: Bắt lỗi khi cập nhật nhà cung cấp
        test('RM_supplierController_TC_012_1 [test_updateSupplier_error] - should return error from server on exception', async () => {
            supplierService.updateSupplier.mockRejectedValue(new Error('fail'));
            await supplierController.updateSupplier(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });

    describe('deleteSupplier', () => {
        // Test case: Xóa nhà cung cấp thành công
        test('RM_supplierController_TC_013 [test_deleteSupplier_success] - should return 200 and delete result', async () => {
            const mockRes = { errCode: 0, message: 'ok' };
            supplierService.deleteSupplier.mockResolvedValue(mockRes);
            await supplierController.deleteSupplier(req, res);
            expect(res.json).toHaveBeenCalledWith(mockRes);
        });

        // Test case: Bắt lỗi khi xóa nhà cung cấp
        test('RM_supplierController_TC_013_1 [test_deleteSupplier_error] - should return error from server on exception', async () => {
            supplierService.deleteSupplier.mockRejectedValue(new Error('fail'));
            await supplierController.deleteSupplier(req, res);
            expect(res.json).toHaveBeenCalledWith({ errCode: -1, errMessage: 'Error from server' });
        });
    });
});
